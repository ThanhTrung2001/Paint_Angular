# Stage 1: Build Angular app
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Angular app with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/paint /usr/share/nginx/html