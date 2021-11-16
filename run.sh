#!/bin/bash

cat > /usr/share/nginx/html/config.js <<EOL
window.ALERTS_URL = '${ALERTS_URL}'
window.FEEDBACK_URL = '${FEEDBACK_URL}'
EOL

echo $ALERTS_URL
echo $FEEDBACK_URL

cat /etc/nginx/conf.d/default.conf.tpl | envsubst \$ADDITIONAL_CSP_HOSTS > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"
