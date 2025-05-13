# Multi-stage build to reduce image size

# Builder stage
FROM python:3.12-slim AS builder

WORKDIR /backend
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
# Final stage
FROM python:3.12-slim

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Set working directory
WORKDIR /backend

# Copy dependencies from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code
COPY --chown=appuser:appuser ./backend /backend/

# Run the FastAPI app
#! PYTHON
#CMD ["python", "run_app.py"]
#! Uvicorn
CMD ["uvicorn", \
     "app_main:app", \
     "--host", "0.0.0.0", \
     "--port", "8080"]
#! GRANIAN
#CMD ["granian", \
#     "--host", "0.0.0.0", \
#     "--port", "443", \
#     "--http2-keep-alive-timeout", "60", \
#     "--workers", "4", \
#     "--http", "auto", \
#     "--interface", "asgi", \
#     "app_main:app"]
