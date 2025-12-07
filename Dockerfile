# digital-hub-web/Dockerfile

FROM node:20-alpine AS base
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Включаем corepack и pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1) Слой зависимостей — только package.json + pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# 2) Слой приложения — копируем остальной код
COPY . .

# Сборка Next.js
RUN pnpm build

# Финальный образ (можно остаться на том же base-слое)
EXPOSE 3000

CMD ["pnpm", "start"]