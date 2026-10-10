# Build Nuxt and its native SQLite dependency on the same platform as runtime.
FROM node:22-alpine AS builder
WORKDIR /app

ENV PNPM_VERSION=10.26.1
RUN npm install -g pnpm@$PNPM_VERSION
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm rebuild

ENV NODE_ENV=production
RUN NITRO_PRESET=node-server pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/.output ./.output
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

CMD ["node", ".output/server/index.mjs"]
