FROM nginx:latest
# Install OpenResty for Lua support
COPY ./nginx/mask_ip_uri.js /etc/nginx/mask_ip_uri.js
COPY ./nginx/ssl /etc/nginx/ssl
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
