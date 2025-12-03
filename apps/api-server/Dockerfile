FROM node:20-alpine

WORKDIR /app

# Install OpenSSL 1.1 compatibility or OpenSSL 3 for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000
CMD npx prisma db push && node dist/server.js
