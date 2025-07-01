#!/bin/sh

# Replace env vars in template
envsubst < /tmp/redis.conf.template > /usr/local/etc/redis/redis.conf

# Run Redis with the rendered config
exec redis-server /usr/local/etc/redis/redis.conf