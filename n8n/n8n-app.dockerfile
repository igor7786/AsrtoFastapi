FROM docker.n8n.io/n8nio/n8n:latest

# Ensure we're running as root (the base image may switch to `node`)
#USER root
#
## Create a non-root user
#RUN adduser --disabled-password --gecos "" n8nuser
#
## Switch to the newly created user
#USER n8nuser

# Optional: Install extra packages here
# RUN apt-get update && apt-get install -y <package-name>

# Start n8n
#CMD ["start"]