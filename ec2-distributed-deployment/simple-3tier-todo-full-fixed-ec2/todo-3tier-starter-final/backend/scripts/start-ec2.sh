#!/bin/sh
set -e

if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
  ./scripts/wait-for-db.sh "$DB_HOST" "$DB_PORT"
fi

echo "Running migrations..."
alembic upgrade head

echo "Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
