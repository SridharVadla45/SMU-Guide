# SMU Guide - GCP Deployment Guide

This guide provides instructions for deploying the SMU Guide application to Google Cloud Platform (GCP) using Cloud Run.

## Prerequisites

1. **Google Cloud Platform Account**
   - Active GCP account with billing enabled
   - Project created in GCP Console

2. **Local Tools**
   - Docker installed and running
   - Google Cloud SDK (gcloud CLI) installed
   - Git installed

3. **Environment Variables**
   - `DATABASE_URL`: MySQL database connection string
   - `JWT_SECRET`: Secret key for JWT token generation

## Architecture

- **Backend (API Server)**: Node.js/Express API deployed on Cloud Run
- **Frontend (Web App)**: React SPA served by Nginx on Cloud Run
- **Database**: External MySQL database (Aiven or Cloud SQL)
- **File Storage**: Cloud Storage for user uploads (recommended)

## Deployment Options

### Option 1: Automated Deployment (Recommended)

1. **Configure the deployment script**:
   ```bash
   # Edit deploy-gcp.sh
   PROJECT_ID="your-gcp-project-id"
   REGION="us-central1"  # Change if needed
   ```

2. **Make the script executable**:
   ```bash
   chmod +x deploy-gcp.sh
   ```

3. **Set up secrets in GCP Secret Manager**:
   ```bash
   # Create DATABASE_URL secret
   echo -n "your-database-url" | gcloud secrets create DATABASE_URL --data-file=-
   
   # Create JWT_SECRET secret
   echo -n "your-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-
   ```

4. **Run the deployment**:
   ```bash
   ./deploy-gcp.sh
   ```

### Option 2: Manual Deployment

#### Deploy Backend

1. **Navigate to backend directory**:
   ```bash
   cd apps/api-server
   ```

2. **Build and push Docker image**:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/smu-guide-api
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy smu-guide-api \
     --image gcr.io/YOUR_PROJECT_ID/smu-guide-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "NODE_ENV=production" \
     --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest" \
     --memory 512Mi \
     --port 4000
   ```

4. **Get the backend URL**:
   ```bash
   gcloud run services describe smu-guide-api --region us-central1 --format 'value(status.url)'
   ```

#### Deploy Frontend

1. **Update API configuration**:
   ```bash
   cd apps/web-app
   ```
   
   Edit `src/config.ts`:
   ```typescript
   export const API_BASE_URL = 'https://your-backend-url/api';
   export const API_URL = 'https://your-backend-url';
   ```

2. **Build and push Docker image**:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/smu-guide-web
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy smu-guide-web \
     --image gcr.io/YOUR_PROJECT_ID/smu-guide-web \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 256Mi \
     --port 8080
   ```

## Local Testing

Before deploying to GCP, test the production builds locally:

```bash
# Build and run with docker-compose
docker-compose -f docker-compose.prod.yml up --build

# Access the application
# Frontend: http://localhost:8080
# Backend: http://localhost:4000
```

## Post-Deployment Configuration

### 1. Database Migration

Run Prisma migrations on your production database:

```bash
# SSH into Cloud Run instance or use Cloud Shell
npx prisma migrate deploy
```

### 2. CORS Configuration

Update backend CORS settings to allow your frontend domain:

```typescript
// apps/api-server/src/app.ts
app.use(cors({
  origin: ['https://your-frontend-url.run.app'],
  credentials: true
}));
```

### 3. Environment Variables

Ensure all required environment variables are set in Cloud Run:

**Backend**:
- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL` (from Secret Manager)
- `JWT_SECRET` (from Secret Manager)

**Frontend**:
- No environment variables needed (configured at build time)

### 4. Custom Domain (Optional)

1. **Map custom domain in Cloud Run**:
   ```bash
   gcloud run domain-mappings create \
     --service smu-guide-web \
     --domain your-domain.com \
     --region us-central1
   ```

2. **Update DNS records** as instructed by GCP

### 5. File Uploads Configuration

For production, configure Cloud Storage for file uploads:

1. **Create a Cloud Storage bucket**:
   ```bash
   gsutil mb -l us-central1 gs://smu-guide-uploads
   ```

2. **Update multer configuration** to use Cloud Storage
3. **Grant Cloud Run service account access** to the bucket

## Monitoring and Logging

### View Logs

```bash
# Backend logs
gcloud run services logs read smu-guide-api --region us-central1

# Frontend logs
gcloud run services logs read smu-guide-web --region us-central1
```

### Set up Monitoring

1. Navigate to Cloud Console → Monitoring
2. Create dashboards for:
   - Request count
   - Response time
   - Error rate
   - Memory usage

### Set up Alerts

```bash
# Example: Alert on high error rate
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05
```

## Cost Optimization

1. **Set minimum instances to 0** for auto-scaling to zero
2. **Use Cloud CDN** for static assets
3. **Enable request/response compression**
4. **Monitor and adjust memory/CPU allocations**

## Troubleshooting

### Common Issues

1. **Build fails**:
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json
   - Check build logs: `gcloud builds list`

2. **Service won't start**:
   - Check environment variables
   - Verify database connectivity
   - Review logs: `gcloud run services logs read SERVICE_NAME`

3. **CORS errors**:
   - Update CORS configuration in backend
   - Verify frontend API_BASE_URL is correct

4. **Database connection fails**:
   - Check DATABASE_URL format
   - Verify database allows connections from Cloud Run IPs
   - Consider using Cloud SQL Proxy

## Security Best Practices

1. **Use Secret Manager** for sensitive data
2. **Enable Cloud Armor** for DDoS protection
3. **Implement rate limiting** in the API
4. **Use HTTPS only** (Cloud Run provides this by default)
5. **Regular security updates** for dependencies
6. **Enable Cloud Audit Logs**

## Rollback

To rollback to a previous version:

```bash
# List revisions
gcloud run revisions list --service smu-guide-api --region us-central1

# Rollback to specific revision
gcloud run services update-traffic smu-guide-api \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## CI/CD Integration

For automated deployments, integrate with Cloud Build:

1. Create `cloudbuild.yaml` in project root
2. Set up Cloud Build triggers on GitHub/GitLab
3. Configure automatic deployments on push to main branch

## Support

For issues or questions:
- Check GCP documentation: https://cloud.google.com/run/docs
- Review application logs
- Contact your team's DevOps lead
