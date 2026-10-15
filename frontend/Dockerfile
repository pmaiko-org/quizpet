FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build


FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5001

CMD ["docker-entrypoint.sh"]
