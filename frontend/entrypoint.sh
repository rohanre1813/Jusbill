#!/bin/sh
# Only substitute $BACKEND_URL — leaves all Nginx $variables intact
envsubst '$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
