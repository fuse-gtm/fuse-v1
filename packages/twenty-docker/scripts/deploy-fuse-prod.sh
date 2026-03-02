#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
SCRIPT_DIR="${SELF_DIR}"
cd "$REPO_ROOT"

as_bool() {
  case "${1:-false}" in
    true|TRUE|1|yes|YES) echo "true" ;;
    *) echo "false" ;;
  esac
}

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
PLATFORM="${PLATFORM:-linux/amd64}"
HEALTH_URL="${HEALTHCHECK_URL:-http://localhost:3000/healthz}"
MAX_WAIT_SECONDS="${MAX_WAIT_SECONDS:-180}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-}"
PUBLIC_HEALTHCHECK_URL="${PUBLIC_HEALTHCHECK_URL:-}"
PUBLIC_MAX_WAIT_SECONDS="${PUBLIC_MAX_WAIT_SECONDS:-180}"
VERIFY_PUBLIC_URL_RAW="${VERIFY_PUBLIC_URL:-}"
REQUESTED_IMAGE_TAG="${1:-}"

PUBLIC_BASE_URL_OVERRIDE="$PUBLIC_BASE_URL"
PUBLIC_HEALTHCHECK_URL_OVERRIDE="$PUBLIC_HEALTHCHECK_URL"
VERIFY_PUBLIC_URL_OVERRIDE="$VERIFY_PUBLIC_URL_RAW"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy packages/twenty-docker/.env.fuse-prod.example to $ENV_FILE first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [ -n "$REQUESTED_IMAGE_TAG" ]; then
  if [[ "${TWENTY_IMAGE:-}" != *:* ]]; then
    echo "TWENTY_IMAGE in $ENV_FILE must include a tag to support tag override." >&2
    exit 1
  fi

  TWENTY_IMAGE_REPO="${TWENTY_IMAGE%:*}"
  TWENTY_IMAGE="${TWENTY_IMAGE_REPO}:${REQUESTED_IMAGE_TAG}"
  echo "Using image tag override: ${TWENTY_IMAGE}"
fi

if [ -n "$PUBLIC_BASE_URL_OVERRIDE" ]; then
  PUBLIC_BASE_URL="$PUBLIC_BASE_URL_OVERRIDE"
fi

if [ -n "$PUBLIC_HEALTHCHECK_URL_OVERRIDE" ]; then
  PUBLIC_HEALTHCHECK_URL="$PUBLIC_HEALTHCHECK_URL_OVERRIDE"
fi

if [ -n "$VERIFY_PUBLIC_URL_OVERRIDE" ]; then
  VERIFY_PUBLIC_URL_RAW="$VERIFY_PUBLIC_URL_OVERRIDE"
fi

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

if [ -n "${GHCR_USERNAME:-}" ] && [ -n "${GHCR_TOKEN:-}" ]; then
  echo "Authenticating to ghcr.io with GHCR_USERNAME/GHCR_TOKEN"
  echo "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin
fi

if [ -z "$VERIFY_PUBLIC_URL_RAW" ]; then
  if [ -n "$PUBLIC_BASE_URL" ] || [ -n "$PUBLIC_HEALTHCHECK_URL" ]; then
    VERIFY_PUBLIC_URL_RAW="true"
  else
    VERIFY_PUBLIC_URL_RAW="false"
  fi
fi

VERIFY_PUBLIC_URL="$(as_bool "$VERIFY_PUBLIC_URL_RAW")"

if [ -z "$PUBLIC_HEALTHCHECK_URL" ] && [ -n "$PUBLIC_BASE_URL" ]; then
  PUBLIC_HEALTHCHECK_URL="${PUBLIC_BASE_URL%/}/healthz"
fi

MODE=prod \
ENV_FILE="$ENV_FILE" \
IMAGE_REF="$TWENTY_IMAGE" \
PLATFORM="$PLATFORM" \
CHECK_IMAGE_EXISTS=true \
CHECK_BUILD_RESOURCES=false \
bash "${SCRIPT_DIR}/fuse-deploy-preflight.sh"

# Guard: external DB requires EXTRA_COMPOSE_FILE (e.g. docker-compose.aws.yml)
# to skip the local db container. Without it a t3.small will OOM.
_PG_HOST="${PG_DATABASE_HOST:-db}"
if [[ "$_PG_HOST" != "db" && "$_PG_HOST" != "localhost" && "$_PG_HOST" != "127.0.0.1" ]]; then
  if [ -z "${EXTRA_COMPOSE_FILE:-}" ]; then
    echo "ERROR: PG_DATABASE_HOST (${_PG_HOST}) is external but EXTRA_COMPOSE_FILE is not set." >&2
    echo "Set EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml to skip local db." >&2
    exit 1
  fi
fi

COMPOSE_ARGS=(
  -f packages/twenty-docker/docker-compose.yml
  -f packages/twenty-docker/docker-compose.fuse.yml
)

if [ -n "${EXTRA_COMPOSE_FILE:-}" ]; then
  COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE_FILE")
fi

COMPOSE_ARGS+=(--env-file "$ENV_FILE")

echo "Deploying ${TWENTY_IMAGE}"
docker compose "${COMPOSE_ARGS[@]}" up -d

START_TS="$(date +%s)"

echo "Waiting for health: ${HEALTH_URL}"
until curl -fsS "$HEALTH_URL" >/dev/null 2>&1; do
  NOW_TS="$(date +%s)"
  if [ $((NOW_TS - START_TS)) -ge "$MAX_WAIT_SECONDS" ]; then
    echo "Timed out waiting for ${HEALTH_URL}" >&2
    docker compose "${COMPOSE_ARGS[@]}" ps
    docker compose "${COMPOSE_ARGS[@]}" logs server --tail 200 || true
    exit 1
  fi
  sleep 3
done

echo "Server healthy"

if [ "$VERIFY_PUBLIC_URL" = "true" ]; then
  if [ -z "$PUBLIC_HEALTHCHECK_URL" ]; then
    echo "VERIFY_PUBLIC_URL=true but PUBLIC_HEALTHCHECK_URL is not set and PUBLIC_BASE_URL is empty." >&2
    exit 1
  fi

  PUBLIC_START_TS="$(date +%s)"
  echo "Waiting for public health: ${PUBLIC_HEALTHCHECK_URL}"
  until curl -fsS "$PUBLIC_HEALTHCHECK_URL" >/dev/null 2>&1; do
    NOW_TS="$(date +%s)"
    if [ $((NOW_TS - PUBLIC_START_TS)) -ge "$PUBLIC_MAX_WAIT_SECONDS" ]; then
      echo "Timed out waiting for ${PUBLIC_HEALTHCHECK_URL}" >&2
      docker compose "${COMPOSE_ARGS[@]}" ps
      docker compose "${COMPOSE_ARGS[@]}" logs server --tail 200 || true
      exit 1
    fi
    sleep 3
  done

  echo "Public health check passed"
else
  echo "Public health verification disabled (VERIFY_PUBLIC_URL=${VERIFY_PUBLIC_URL})"
fi

if [ -n "${WORKSPACE_ID:-}" ]; then
  echo "Bootstrapping Partner OS for workspace ${WORKSPACE_ID}"
  docker compose "${COMPOSE_ARGS[@]}" exec -T server \
    yarn command:prod workspace:bootstrap:partner-os -w "${WORKSPACE_ID}"
  echo "Partner OS bootstrap complete"
else
  echo "WORKSPACE_ID not set. Skipping Partner OS bootstrap."
fi
