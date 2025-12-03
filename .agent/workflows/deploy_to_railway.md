---
description: How to deploy the SMU Guide application (Backend & Frontend) to Railway with Aiven Database
---

# Deploying SMU Guide to Railway

This guide outlines the steps to deploy the SMU Guide application to Railway, connecting to a MySQL database hosted on Aiven.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Railway Account**: Sign up at [railway.app](https://railway.app/).
3.  **Aiven Account**: Ensure you have your MySQL service running on Aiven.

## Step 1: Prepare Database (Aiven)

1.  Log in to your Aiven console.
2.  Go to your MySQL service.
3.  Copy the **Service URI** (Connection String). It typically looks like:
    `mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED`
4.  **Important**: For Prisma, you might need to ensure the SSL mode is compatible. Usually, Aiven requires SSL. Ensure your connection string ends with `?ssl-mode=REQUIRED` or `?sslaccept=strict`.

## Step 2: Deploy Backend (API Server)

1.  **Create New Project on Railway**:
    *   Click "New Project" -> "Deploy from GitHub repo".
    *   Select your `SMU-Guide` repository.
    *   Select "Deploy Now".

2.  **Configure Service**:
    *   Once the service is created, click on it to open settings.
    *   Go to **Settings** -> **General**.
    *   **Root Directory**: Set to `apps/api-server`.
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
        *   *Note: We need to generate the Prisma client before building.*
    *   **Start Command**: `npm start`
    *   **Watch Paths**: You can ignore this or set to `apps/api-server/**`.

3.  **Environment Variables**:
    *   Go to the **Variables** tab.
    *   Add the following variables:
        *   `DATABASE_URL`: Paste your Aiven connection string here.
        *   `PORT`: `8080` (or let Railway assign one, but your app should listen on `process.env.PORT`).
        *   `JWT_SECRET`: Generate a strong random string (e.g., using `openssl rand -hex 32`).
        *   `CORS_ORIGIN`: You will update this later with your Frontend URL (e.g., `https://web-app-production.up.railway.app`). For now, you can set it to `*` for testing, but lock it down later.

4.  **Networking**:
    *   Go to **Settings** -> **Networking**.
    *   Click "Generate Domain" to get a public URL (e.g., `api-server-production.up.railway.app`).
    *   **Copy this URL**. You will need it for the frontend.

5.  **Deploy**:
    *   Railway should automatically redeploy when you save settings. Check the "Deployments" tab for logs.
    *   If the build fails on Prisma, ensure `DATABASE_URL` is correct.

## Step 3: Deploy Frontend (Web App)

1.  **Add New Service**:
    *   In the same Railway project, click "+ New" -> "GitHub Repo".
    *   Select the same `SMU-Guide` repository again.

2.  **Configure Service**:
    *   Click on the new service.
    *   Go to **Settings** -> **General**.
    *   **Root Directory**: Set to `apps/web-app`.
    *   **Build Command**: `npm install && npm run build`
    *   **Output Directory**: `dist`
    *   *Railway will automatically detect this as a static site deployment if you are using Vite.*

3.  **Environment Variables**:
    *   Go to the **Variables** tab.
    *   Add the following variable:
        *   `VITE_API_URL`: Paste the **Backend URL** you copied earlier (e.g., `https://api-server-production.up.railway.app`).
        *   *Important: Ensure there is NO trailing slash (e.g., NOT `...app/`).*

4.  **Networking**:
    *   Go to **Settings** -> **Networking**.
    *   Click "Generate Domain" to get a public URL for your frontend.

5.  **Deploy**:
    *   The app should deploy. Once finished, visit the frontend URL.

## Step 4: Final Configuration

1.  **Update Backend CORS**:
    *   Go back to your **Backend Service** -> **Variables**.
    *   Update `CORS_ORIGIN` to your actual **Frontend URL** (e.g., `https://web-app-production.up.railway.app`).
    *   This ensures only your frontend can call your API.

2.  **Database Migrations**:
    *   Since you are using Aiven, you might need to run migrations.
    *   You can run them locally pointing to the Aiven DB:
        `DATABASE_URL="your-aiven-url" npx prisma migrate deploy`
    *   Or add `npx prisma migrate deploy` to your Backend **Build Command** (before `npm run build`), but be careful as this runs on every deploy.

## Troubleshooting

*   **Build Fails**: Check the logs. Common issues are missing dependencies or wrong root directory.
*   **Database Connection Error**: Verify the `DATABASE_URL` and ensure Aiven allows connections from anywhere (0.0.0.0/0) or configure VPC peering (advanced).
*   **CORS Errors**: Check the browser console. Ensure `VITE_API_URL` is correct and `CORS_ORIGIN` on the backend matches the frontend domain.
