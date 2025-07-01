FROM redis:7.0.10-alpine
RUN apk add --no-cache gettext
RUN mkdir -p /usr/local/etc/redis
# Copy config template and entrypoint script to root or a known location
COPY ./redis/redis.conf.template /tmp/redis.conf.template
COPY ./redis/runredis.sh /runredis.sh
RUN chmod +x /runredis.sh