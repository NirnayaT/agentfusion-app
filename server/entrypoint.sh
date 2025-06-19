#!/bin/bash
set -e

echo "Starting entrypoint script..."
echo "Command: $@"

# Wait for Postgres to be ready
echo "Waiting for Postgres..."
while ! nc -z db 5432; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done
echo "Postgres is up!"

# Run Alembic migrations ONLY IF the command contains 'uvicorn'
# This ensures migrations are run by the FastAPI service
if echo "$@" | grep -q "uvicorn"; then
    echo "Running Alembic migrations..."
    # Ensure uv is in the path or use python -m
    uv run alembic upgrade head
    echo "Migrations completed!"
fi

# Start the appropriate service
echo "Starting service: $@"
exec "$@"