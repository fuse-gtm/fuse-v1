#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
WORKSPACE_ID="${WORKSPACE_ID:-}"
EXTRA_COMPOSE_FILE="${EXTRA_COMPOSE_FILE:-}"

if [ -z "$WORKSPACE_ID" ]; then
  echo "WORKSPACE_ID is required." >&2
  echo "Example: WORKSPACE_ID=<uuid> bash packages/twenty-docker/scripts/fuse-tenant-bootstrap.sh" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

COMPOSE_ARGS=(
  -f packages/twenty-docker/docker-compose.yml
  -f packages/twenty-docker/docker-compose.fuse.yml
)

if [ -n "$EXTRA_COMPOSE_FILE" ]; then
  COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE_FILE")
fi

COMPOSE_ARGS+=(--env-file "$ENV_FILE")

echo "Bootstrapping Fuse baseline for workspace ${WORKSPACE_ID}"
docker compose "${COMPOSE_ARGS[@]}" exec -T server \
  yarn command:prod workspace:bootstrap:partner-os -w "$WORKSPACE_ID"

echo "Re-running bootstrap for idempotency check"
docker compose "${COMPOSE_ARGS[@]}" exec -T server \
  yarn command:prod workspace:bootstrap:partner-os -w "$WORKSPACE_ID"

echo "Fuse tenant bootstrap completed for ${WORKSPACE_ID}"
