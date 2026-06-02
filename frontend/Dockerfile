# ============================================================
# Stage 1: Build — Node.js
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# VITE_API_BASE_URL dùng relative path "/api/v1" để nginx proxy đến backend
# Có thể override lúc build: docker build --build-arg VITE_API_BASE_URL=...
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ============================================================
# Stage 2: Serve — Nginx
# ============================================================
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
