FROM node:22-alpine AS node

FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm
RUN ln -s /usr/local/bin/node /usr/bin/node

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

EXPOSE 4999

CMD sh -c "nginx && node .output/server/index.mjs"