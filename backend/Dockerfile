# Stage 1: build
FROM node:22.18.0-bullseye-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=3072" npm run build

# Stage 2: production
FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

RUN apk add --no-cache rclone fuse3 bash postgresql-client
RUN mkdir -p /storage
VOLUME ["/storage"]

CMD ["sh", "-c", "rclone mount gdrive: /storage --vfs-cache-mode=off --allow-other --allow-non-empty & node dist/main.js"]
