FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
WORKDIR /backend
COPY ./backend .

# Install the application dependencies.
RUN uv sync --frozen --no-cache

# Run the application.
CMD ["/backend/.venv/bin/uvicorn", "app_main:app", "--port", "8080", "--host", "0.0.0.0"]
