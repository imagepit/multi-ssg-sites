# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# pnpm (optional). fallback to npm if not present on host
RUN corepack enable && corepack prepare pnpm@latest --activate || true

COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --ignore-scripts; \
    elif [ -f package-lock.json ]; then npm ci --ignore-scripts; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --ignore-scripts; \
    else npm i --ignore-scripts; fi

COPY . .

ENV HOST=0.0.0.0 PORT=4000
EXPOSE 4000

CMD ["pnpm", "dev", "-p", "4000"]
