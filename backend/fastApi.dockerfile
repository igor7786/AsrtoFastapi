FROM python:3.11-slim

# Create and switch to a non-root user
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Set the working directory inside the container
WORKDIR /backend
#RUN mkdir -p /backend/app_db  # Ensure app_db directory exists

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the entire application code, including the app_db directory
COPY --chown=appuser:appuser . .

CMD ["python", "run_app.py"]
