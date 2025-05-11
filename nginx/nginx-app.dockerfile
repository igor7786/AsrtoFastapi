FROM nginx:latest

# Copy required files
COPY ./nginx/mask_ip_uri.js /etc/nginx/mask_ip_uri.js
COPY ./nginx/ssl /etc/nginx/ssl
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Ensure the logs directory exists and create the access.log file
RUN mkdir -p /etc/nginx/logs && touch /etc/nginx/logs/access.log

# Set correct permissions
RUN chmod -R 755 /etc/nginx/logs && chown -R nginx:nginx /etc/nginx/logs

CMD ["nginx", "-g", "daemon off;"]

