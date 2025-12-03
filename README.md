# SMU-Guide

A web-based platform connecting university students with mentors (alumni and professors) for academic guidance and career support.

## Features

- 🎓 **Mentor Discovery** - Browse and search mentor profiles
- 📅 **Appointment Booking** - Schedule meetings with mentors
- 💬 **Community Forum** - Ask questions and get answers
- 💳 **Payment Processing** - Secure payment handling
- 👤 **Profile Management** - Manage your profile and avatar

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- Prisma ORM + MySQL
- JWT Authentication

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/SridharVadla45/SMU-Guide.git
cd SMU-Guide
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Start MySQL using Docker Compose:

```bash
docker-compose up -d
```

This will start MySQL on port `3307` with:
- Database: `smuguide`
- User: `test`
- Password: `test123`

### 4. Configure Environment Variables

#### Backend (API Server)

Create `apps/api-server/.env`:

```env
# Database
DATABASE_URL="mysql://test:test123@localhost:3307/smuguide"

# Server
PORT=8080

# JWT Secret (change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

#### Frontend (Web App)

Create `apps/web-app/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

### 5. Setup Database Schema

Navigate to the API server and run Prisma migrations:

```bash
cd apps/api-server
npx prisma db push
npx prisma generate
```

### 6. (Optional) Seed Database

```bash
npx prisma db seed
```

### 7. Start Development Servers

#### Terminal 1 - Backend:

```bash
cd apps/api-server
npm run dev
```

Backend will run on: http://localhost:8080

#### Terminal 2 - Frontend:

```bash
cd apps/web-app
npm run dev
```

Frontend will run on: http://localhost:5173

### 8. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

## Default Test Accounts

After seeding, you can login with:

**Student:**
- Email: `student@example.com`
- Password: `password123`

**Mentor:**
- Email: `mentor@example.com`
- Password: `password123`

## Project Structure

```
SMU-Guide/
├── apps/
│   ├── api-server/          # Backend (Node.js + Express)
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   └── web-app/             # Frontend (React + Vite)
│       ├── src/
│       └── package.json
├── docker-compose.yml       # MySQL container
└── package.json             # Root workspace
```

## Available Scripts

### Backend (`apps/api-server`)

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
```

### Frontend (`apps/web-app`)

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Check if MySQL is running:
   ```bash
   docker-compose ps
   ```

2. Restart the container:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Verify the `DATABASE_URL` in `apps/api-server/.env` matches your MySQL configuration

### Port Already in Use

If port 8080 or 5173 is already in use:

1. Change the port in `apps/api-server/.env`:
   ```env
   PORT=3000
   ```

2. Update the frontend `.env` to match:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Prisma Client Not Found

If you see "Cannot find module '@prisma/client'":

```bash
cd apps/api-server
npx prisma generate
```

## License

ISC

## Author

Sridhar Vadla

## Repository

https://github.com/SridharVadla45/SMU-Guide
