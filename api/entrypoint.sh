#!/bin/sh

echo "Waiting for PostgreSQL service..."

# Try to connect to the PostgreSQL service.
# If unavailable, sleep for 0.1 seconds and try again
while ! nc -z $POSTGRES_HOSTNAME $POSTGRES_PORT; do
  sleep 0.1
done

echo "PostgreSQL service available"

echo "Initializing databse..."

# Initialize the database
python manage.py init-db

echo "Initialized databse"

echo "Starting Flask server..."

# Execute command given by Docker
exec "$@"
