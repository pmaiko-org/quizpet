FROM node:22.18.0-alpine AS build

ARG PUBLIC_URL
ARG DATABASE_CLIENT

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
ENV DATABASE_CLIENT=${DATABASE_CLIENT}
RUN npm run build

FROM node:22.18.0-alpine

RUN apk add --no-cache vips-dev rclone fuse3 su-exec \
  && echo user_allow_other >> /etc/fuse.conf

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV PATH=/opt/app/node_modules/.bin:$PATH

WORKDIR /opt

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

WORKDIR /opt/app

COPY --from=build /opt/app ./

RUN chown -R node:node /opt/app
RUN chmod +x docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/_health || exit 1

ENTRYPOINT ["/opt/app/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
