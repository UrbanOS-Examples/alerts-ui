#!/bin/bash

cat /etc/nginx/conf.d/default.conf.tpl | envsubst \$ADDITIONAL_CSP_HOSTS > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"