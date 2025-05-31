FROM python:3.12-slim

# Install uv first (before switching user)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Set working directory
#WORKDIR /backend

# Copy the FastAPI app source
COPY --chown=appuser:appuser ./backend /backend/
WORKDIR /backend
# Set path (if needed)
ENV PATH=/home/appuser/.local/bin:$PATH

# Ensure uv lock file is respected
RUN uv sync --locked


#! Run the FastAPI app
#! PYTHON
#CMD ["python", "run_app.py"]
#! Uvicorn
#CMD [".venv/bin/uvicorn", \
#     "app_main:app", \
#     "--host", "0.0.0.0", \
#     "--port", "8080"]
#! UV
#CMD ["uv","run", "run.py"]