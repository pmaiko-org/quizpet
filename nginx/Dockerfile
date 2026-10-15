FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx/media \
  && chown -R nginx:nginx /var/cache/nginx

EXPOSE 4999
