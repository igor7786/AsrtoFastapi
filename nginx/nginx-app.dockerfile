FROM nginx:latest

# Install envsubst (comes with gettext)
RUN apt-get update && \
    apt-get install -y gettext && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Copy required files
COPY ./nginx/mask_ip_uri.js /etc/nginx/mask_ip_uri.js
COPY ./nginx/ssl /etc/nginx/ssl
#COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
#COPY ./nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY ./nginx/run-nginx.sh /etc/nginx/run-nginx.sh
# Ensure the logs directory exists and create the access.log file
RUN mkdir -p /etc/nginx/logs && touch /etc/nginx/logs/access.log


# Set correct permissions
RUN chmod +x /etc/nginx/run-nginx.sh
RUN chmod -R 755 /etc/nginx/logs && chown -R nginx:nginx /etc/nginx/logs

# Clean up apt cache to reduce image size
RUN apt-get remove --purge -y \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
#CMD ["nginx", "-g", "daemon off;"]
# Use envsubst to render config at container startup
#CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
