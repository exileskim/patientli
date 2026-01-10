#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Patientli dev setup"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node 20+ and re-run."
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "${NODE_MAJOR}" -lt 20 ]; then
  echo "Node 20+ is required. Current: $(node -v)"
  exit 1
fi

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example (fill in required values)."
fi

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if command -v docker >/dev/null 2>&1; then
  if docker info >/dev/null 2>&1; then
    echo "Starting Postgres via docker compose..."
    docker compose up -d db
  else
    echo "Docker is installed but the daemon is not running. Start Docker Desktop to use the local DB."
  fi
else
  echo "Docker not found; skipping local DB startup."
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

if [ -n "${DATABASE_URL:-}" ]; then
  echo "Running Prisma migrate + seed..."
  npx prisma migrate dev
  npm run db:seed
else
  echo "DATABASE_URL is not set; skipping Prisma migrate + seed."
fi

echo "Done. Start the app with: npm run dev"

