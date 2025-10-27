FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database
COPY apps/api/package.json ./apps/api/

RUN yarn install --frozen-lockfile

ENV PORT=3000
ENV THROTTLE_TTL=60
ENV THROTTLE_LIMIT=10
ENV RABBITMQ_URL="amqp://admin:admin@rabbimq:5672"
ENV AUTH_QUEUE="auth_queue"
ENV TASKS_QUEUE="tasks_queue"
ENV GATEWAY_QUEUE="gateway_queue"
ENV NOTIFICATIONS_QUEUE="notifications_queue"

COPY packages/core ./packages/core
COPY apps/api ./apps/api

RUN yarn turbo run build --filter=api

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core ./packages/core

EXPOSE 3000
CMD ["node", "dist/main.js"]
