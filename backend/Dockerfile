# Stage 1: build
FROM node:22.18.0-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=3072" npm run build

# Stage 2: production
FROM node:22.18.0-alpine

WORKDIR /app

RUN apk add --no-cache rclone fuse3 bash postgresql-client \
  && echo user_allow_other >> /etc/fuse.conf \
  && mkdir -p /storage

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
