FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY apps/web/package.json ./apps/web/

RUN yarn install --frozen-lockfile

ENV VITE_API_URL="http://api-gateway:3000/api"
ENV VITE_API_SOCKET="ws://api-gateway:3000/api"

COPY packages/core ./packages/core
COPY apps/web ./apps/web

RUN yarn turbo run build --filter=web

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
