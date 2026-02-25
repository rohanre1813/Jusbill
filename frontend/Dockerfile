# ─────────────────────────────────────────────
# Stage 1: base
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./

# ─────────────────────────────────────────────
# Stage 2: development
# ─────────────────────────────────────────────
FROM base AS development

RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─────────────────────────────────────────────
# Stage 3: builder
# ─────────────────────────────────────────────
FROM base AS builder

RUN npm install
COPY . .

# /api is the relative proxy path — Nginx handles routing to the real backend
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─────────────────────────────────────────────
# Stage 4: production (Nginx)
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template and custom entrypoint
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
