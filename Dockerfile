# ─── Stage 1: Build the React frontend ──────────────────────────────────────
FROM node:20-alpine AS build-frontend

WORKDIR /app/frontend

# Install dependencies
COPY ecommerce_export/frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY ecommerce_export/frontend/ ./
RUN npm run build


# ─── Stage 2: Production backend + static assets ─────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app/backend

# Install backend dependencies
COPY ecommerce_export/backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY ecommerce_export/backend/ ./           
# Copy the built React app into the backend's public directory
# Express will serve these static files
COPY --from=build-frontend /app/frontend/dist ./public

# Expose the port Express listens on (default 5000)
EXPOSE 3001

# Environment defaults (override at runtime)
ENV NODE_ENV=production \
    PORT=3001
CMD ["node", "server.js"]
