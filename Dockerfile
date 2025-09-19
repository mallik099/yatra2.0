# Multi-stage build for React frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine as backend

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY --from=backend /app ./backend

# Copy frontend build
COPY --from=frontend-build /app/dist ./frontend/dist

# Install serve to serve frontend
RUN npm install -g serve

# Expose ports
EXPOSE 5000 3000

# Create startup script
RUN echo '#!/bin/sh\ncd /app/backend && npm start &\nserve -s /app/frontend/dist -l 3000' > /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]