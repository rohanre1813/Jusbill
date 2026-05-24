FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    curl \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libglib2.0-0 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

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
