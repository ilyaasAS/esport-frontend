FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Durcissement ANSSI : image Nginx non-privilégiée (uid 101, écoute sur un port > 1024).
# Compatible Cloud Run (écoute sur 8080) sans aucune capability réseau privilégiée.
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
