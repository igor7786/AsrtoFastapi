# ./n8n/Dockerfile
FROM docker.n8n.io/n8nio/n8n:latest

# Optional: Install extra packages or dependencies here
# RUN apt-get update && apt-get install -y <package-name>

# Default entrypoint is already `start`, so we can override CMD
CMD ["start", "--tunnel"]
