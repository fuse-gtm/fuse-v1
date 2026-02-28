#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$REPO_ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy packages/twenty-docker/.env.fuse-prod.example to $ENV_FILE first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [ -z "${TWENTY_IMAGE:-}" ]; then
  echo "TWENTY_IMAGE must be set in $ENV_FILE" >&2
  exit 1
fi

if [ -z "${SERVER_URL:-}" ]; then
  echo "SERVER_URL must be set in $ENV_FILE" >&2
  exit 1
fi

if [ -z "${APP_SECRET:-}" ]; then
  echo "APP_SECRET must be set in $ENV_FILE" >&2
  exit 1
fi

if [ -z "${PG_DATABASE_PASSWORD:-}" ]; then
  echo "PG_DATABASE_PASSWORD must be set in $ENV_FILE" >&2
  exit 1
fi

COMPOSE_ARGS=(
  -f packages/twenty-docker/docker-compose.yml
  -f packages/twenty-docker/docker-compose.fuse.yml
  --env-file "$ENV_FILE"
)

echo "Deploying ${TWENTY_IMAGE}"
docker compose "${COMPOSE_ARGS[@]}" up -d

HEALTH_URL="${SERVER_URL%/}/healthz"
MAX_WAIT_SECONDS="${MAX_WAIT_SECONDS:-180}"
START_TS="$(date +%s)"

echo "Waiting for health: ${HEALTH_URL}"
until curl -fsS "$HEALTH_URL" >/dev/null 2>&1; do
  NOW_TS="$(date +%s)"
  if [ $((NOW_TS - START_TS)) -ge "$MAX_WAIT_SECONDS" ]; then
    echo "Timed out waiting for ${HEALTH_URL}" >&2
    docker compose "${COMPOSE_ARGS[@]}" ps
    exit 1
  fi
  sleep 3
done

echo "Server healthy"

if [ -n "${WORKSPACE_ID:-}" ]; then
  echo "Bootstrapping Partner OS for workspace ${WORKSPACE_ID}"
  docker compose "${COMPOSE_ARGS[@]}" exec -T server \
    yarn command:prod workspace:bootstrap:partner-os -w "${WORKSPACE_ID}"
  echo "Partner OS bootstrap complete"
else
  echo "WORKSPACE_ID not set. Skipping Partner OS bootstrap."
fi
