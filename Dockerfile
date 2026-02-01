# 🧱 Stage 1 — build
FROM node:20-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

# Включаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем только манифесты для установки зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем deps для билда
RUN pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Собираем Next.js
RUN pnpm build

# Удаляем dev-зависимости, чтобы не тащить их в рантайм
RUN pnpm prune --prod


# 🧱 Stage 2 — runtime (минимум, не root)
FROM node:20-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

# 🔒 создаём непривилегированного пользователя
RUN addgroup -g 1001 nodeapp \
  && adduser -D -u 1001 -G nodeapp nodeapp

# ⛔ по максимуму убираем лишние инструменты из рантайма
# (busybox всё равно даёт базовый sh/wget, но curl/bash/apk мы чистим, если они есть)
RUN apk update && apk del --no-cache curl wget bash || true

# Копируем собранное приложение и node_modules только из builder-образа
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# Права на файлы — нашему пользователю
RUN chown -R nodeapp:nodeapp /app

USER nodeapp

EXPOSE 3000

# Стартуем только Next.js, без sh-обёрток
CMD ["node", "node_modules/next/dist/bin/next", "start"]