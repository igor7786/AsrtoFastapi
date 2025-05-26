
#! Multi-stage build to reduce image size
#! Builder stage
FROM python:3.12-slim AS builder
#! set working directory
WORKDIR /backend
#! Final stage
FROM python:3.12-slim

#! Create a non-root user and switch to it
RUN adduser --disabled-password --gecos "" appuser
#! Switch to appuser
USER appuser

#! Set working directory
WORKDIR /backend

#! Copy dependencies from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
#! Copy the application code
COPY --chown=appuser:appuser ./backend /backend/

#! Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
#! Create virtual environment and install dependencies
RUN uv sync --frozen --no-cache

#! Run the FastAPI app
#! PYTHON
#CMD ["python", "run_app.py"]
#! Uvicorn
#CMD [".venv/bin/uvicorn", \
#     "app_main:app", \
#     "--host", "0.0.0.0", \
#     "--port", "8080"]
#! UV
CMD ["uv","run", "run.py"]