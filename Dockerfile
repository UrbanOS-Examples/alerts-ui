FROM node:16-alpine AS builder
COPY . /app/src
WORKDIR /app/src
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && npm install \
    && apk del .gyp
RUN npm run build
FROM nginx
RUN apt-get -y update &&\
    apt-get install -y nginx-extras &&\
    rm /etc/nginx/sites-enabled/default
COPY --from=builder /app/src/build /usr/share/nginx/html
COPY --from=builder /app/src/run.sh /run.sh
COPY --from=builder /app/src/nginx-default.conf /etc/nginx/conf.d/default.conf.tpl
WORKDIR /usr/share/nginx/html
CMD ["/run.sh"]
