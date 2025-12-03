#!/bin/bash

# SMU Guide - GCP Cloud Run Deployment Script
# This script builds and deploys both backend and frontend to Google Cloud Run

set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
BACKEND_SERVICE_NAME="smu-guide-api"
FRONTEND_SERVICE_NAME="smu-guide-web"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== SMU Guide GCP Deployment ===${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}Please login to gcloud:${NC}"
    gcloud auth login
fi

# Set project
echo -e "${YELLOW}Setting GCP project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}Enabling required GCP APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com

# Build and deploy backend
echo -e "${GREEN}=== Building and deploying backend ===${NC}"
cd apps/api-server

gcloud builds submit \
    --tag gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME \
    --timeout=20m

gcloud run deploy $BACKEND_SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "NODE_ENV=production" \
    --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 4000 \
    --timeout 300

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Backend deployed at: $BACKEND_URL${NC}"

cd ../..

# Build and deploy frontend
echo -e "${GREEN}=== Building and deploying frontend ===${NC}"
cd apps/web-app

# Update API URL in config before building
echo "export const API_BASE_URL = '$BACKEND_URL/api';" > src/config.ts
echo "export const API_URL = '$BACKEND_URL';" >> src/config.ts

gcloud builds submit \
    --tag gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME \
    --timeout=20m

gcloud run deploy $FRONTEND_SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 8080 \
    --timeout 60

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE_NAME --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Frontend deployed at: $FRONTEND_URL${NC}"

cd ../..

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Backend URL: ${YELLOW}$BACKEND_URL${NC}"
echo -e "Frontend URL: ${YELLOW}$FRONTEND_URL${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Set up your secrets in GCP Secret Manager:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "2. Configure your custom domain (optional)"
echo "3. Set up Cloud CDN for better performance (optional)"
