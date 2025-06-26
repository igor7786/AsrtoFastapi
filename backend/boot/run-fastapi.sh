#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
RUN_PORT=${FAST_API_PORT:-8080}
RUN_HOST=${FAST_API_HOST:-0.0.0.0}
# Check ENV variable
if [ "$ENV" == "dev" ]; then
  echo "[+] Running in development mode ..."
  uv run uvicorn app_main:app --reload --host $RUN_HOST --port $RUN_PORT

else
  echo "[+] Running in production mode ..."
  uv run gunicorn app_main:app \
    --workers 4 \
    --bind $RUN_HOST:$RUN_PORT \
    --worker-class uvicorn.workers.UvicornWorker
fi

