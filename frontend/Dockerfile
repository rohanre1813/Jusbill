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

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─────────────────────────────────────────────
# Stage 3: builder  (Vite production build)
# ─────────────────────────────────────────────
FROM base AS builder

RUN npm install

COPY . .

# Vite bakes VITE_API_URL at build time — set to /api so all
# requests go through the Nginx proxy (same origin = cookies work!)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─────────────────────────────────────────────
# Stage 4: production  (Nginx static server)
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# Nginx's built-in template processing will call envsubst automatically
# for any files in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]
