#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
fi

echo "Starting application..."
exec node server.js
