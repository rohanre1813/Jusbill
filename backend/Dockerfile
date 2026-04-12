FROM node:20-slim AS base

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# ─────────────────────────────────────────────
# Stage 2: development
# ─────────────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────
# Stage 3: production
# ─────────────────────────────────────────────
FROM base AS production

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
