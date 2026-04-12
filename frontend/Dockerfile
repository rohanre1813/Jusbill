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

# Declare the build-time arg so Vite can bake it into the bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─────────────────────────────────────────────
# Stage 4: production  (Nginx static server)
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config to support React Router and internal API Reverse Proxy
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location ~ ^/(auth|products|invoice|customers|users|purchases|chat) {\n\
        proxy_pass http://jusbill-backend:5000;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
