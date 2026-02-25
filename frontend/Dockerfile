# ─────────────────────────────────────────────
# Stage 1: base  (shared node layer)
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

# ─────────────────────────────────────────────
# Stage 2: development  (Vite dev server)
# ─────────────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

EXPOSE 5173

# Run Vite dev server, binding to all interfaces so Docker can expose it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─────────────────────────────────────────────
# Stage 3: builder  (Vite production build)
# ─────────────────────────────────────────────
FROM base AS builder

RUN npm install

COPY . .

RUN npm run build

# ─────────────────────────────────────────────
# Stage 4: production  (Nginx static server)
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config to support React Router (SPA fallback)
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
