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

# # Verify database connection
# echo "Verifying database connection..."
# max_attempts=30
# attempt=0

# while [ $attempt -lt $max_attempts ]; do
#     if psql "$SQLALCHEMY_DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
#         echo "Database connection verified!"
#         break
#     fi
    
#     attempt=$((attempt + 1))
#     echo "Database connection attempt $attempt/$max_attempts failed, retrying..."
#     sleep 2
# done

# if [ $attempt -eq $max_attempts ]; then
#     echo "Error: Could not connect to database after $max_attempts attempts"
#     echo "DATABASE_URL: $SQLALCHEMY_DATABASE_URL"
#     exit 1
# fi

# Run Alembic migrations (only for FastAPI service to avoid conflicts)
if [[ "$1" == "uvicorn" ]]; then
    echo "Running Alembic migrations..."
    uv run alembic upgrade head
    echo "Migrations completed!"
fi

# Start the appropriate service
echo "Starting service: $@"
exec "$@"