#!/bin/sh
set -e

HOST="$1"
PORT="$2"

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Usage: wait-for-db.sh <host> <port>"
  exit 1
fi

echo "Waiting for database at $HOST:$PORT ..."

for i in $(seq 1 60); do
  if nc -z "$HOST" "$PORT"; then
    echo "Database is reachable"
    exit 0
  fi
  sleep 2
done

echo "Database not reachable after waiting"
exit 1
