FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads/avatars

EXPOSE 4000

CMD ["node", "dist/server.js"]
