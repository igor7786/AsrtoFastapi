#FROM python:3.12-slim
#
## Install uv first (before switching user)
#COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
## Install os dependencies for our mini vm
#RUN apt-get update && apt-get install -y \
#    # for postgres
#    libpq-dev \
#    # for Pillow
#    libjpeg-dev \
#    # for CairoSVG
#    libcairo2 \
#    # other
#    gcc \
#    && rm -rf /var/lib/apt/lists/*
## Set global Python environment variables early
#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1
## Create a non-root user and switch to it
#RUN adduser --disabled-password --gecos "" appuser
#USER appuser
## Set working directory
##WORKDIR /backend
#
## Copy the FastAPI app source
#COPY --chown=appuser:appuser ./backend /backend/
#WORKDIR /backend
## Set path (if needed)
#ENV PATH=/home/appuser/.local/bin:$PATH
#
## Ensure uv lock file is respected
#RUN uv sync --locked
#
#RUN chmod +x /backend/boot/run-fastapi.sh
#
#USER root
## Clean up apt cache to reduce image size
#RUN apt-get remove --purge -y \
#    && apt-get autoremove -y \
#    && apt-get clean \
#    && rm -rf /var/lib/apt/lists/*
#
##! Run the FastAPI app
##! PYTHON
##CMD ["python", "run_app.py"]
##! Uvicorn
##CMD [".venv/bin/uvicorn", \
##     "app_main:app", \
##     "--host", "0.0.0.0", \
##     "--port", "8080"]
##! UV
##CMD ["uv","run", "run.py"]

#? ============ STAGE 1: Builder ============
FROM python:3.12-slim-bullseye AS builder

# Install uv binary
COPY --from=ghcr.io/astral-sh/uv:0.7.12 /uv /uvx /bin/

# Create non-root user with fixed UID
RUN adduser --disabled-password --gecos "" --uid 1000 appuser

# Set Python env variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/appuser/.local/bin:$PATH \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl gcc libc-dev python3-dev libpq-dev libjpeg-dev libcairo2 \
 && apt-get clean && rm -rf /var/lib/apt/lists/*


# Copy project files
COPY --chown=appuser:appuser ./backend/requirements.txt /backend/requirements.txt
WORKDIR /backend
USER appuser

# Sync Python dependencies using uv
RUN uv init --app \
    && uv venv \
    && uv add -r requirements.txt
# Then copy full project files
COPY --chown=appuser:appuser ./backend /backend

#? ============ STAGE 2: Final Image ============
FROM python:3.12-slim-bullseye

# Copy uv binary
COPY --from=builder /bin/uv /bin/uv
COPY --from=builder /bin/uvx /bin/uvx

# Create same non-root user with same UID
RUN adduser --disabled-password --gecos "" --uid 1000 appuser

# Set environment and working directory
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/appuser/.local/bin:$PATH \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /backend

# Copy installed dependencies and code from builder
COPY --from=builder /backend /backend
COPY --from=builder /home/appuser /home/appuser

# Make sure startup script is executable
RUN chmod +x /backend/boot/run-fastapi.sh

# Switch to non-root user
USER appuser


