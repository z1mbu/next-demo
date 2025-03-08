#!/bin/sh
set -e

# Wait for PostgreSQL to be available
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h db -p 5432; do
  sleep 1
done

echo "PostgreSQL is up - running migrations..."

# Run the migration SQL file
psql $DATABASE_URL -f ./migrations/init.sql

echo "Migrations applied successfully. Starting the Next.js app..."

# Start the Next.js app
exec npm start
