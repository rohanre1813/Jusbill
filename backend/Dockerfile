# ─────────────────────────────────────────────
# Stage 1: base  (shared dependencies)
# ─────────────────────────────────────────────
FROM node:20-slim AS base

# Install Chromium system deps required by Puppeteer
RUN apt-get update && apt-get install -y \
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

# Tell Puppeteer to use the system Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./

# ─────────────────────────────────────────────
# Stage 2: development
# ─────────────────────────────────────────────
FROM base AS development

# Install ALL deps (including devDependencies for nodemon)
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────
# Stage 3: production
# ─────────────────────────────────────────────
FROM base AS production

# Install only production deps
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
