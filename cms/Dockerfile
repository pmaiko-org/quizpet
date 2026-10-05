FROM node:22-alpine AS build

ARG PUBLIC_URL

ENV NODE_OPTIONS=--max-old-space-size=2048

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git

WORKDIR /opt

COPY package*.json ./
RUN npm ci

ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app

COPY . .

ENV NODE_ENV=production
ENV PUBLIC_URL=${PUBLIC_URL}
RUN npm run build

FROM node:22-alpine

RUN apk add --no-cache vips-dev

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV PATH=/opt/app/node_modules/.bin:$PATH

WORKDIR /opt

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

WORKDIR /opt/app

COPY --from=build /opt/app ./

RUN chown -R node:node /opt/app

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/_health || exit 1

CMD ["npm", "run", "start"]
