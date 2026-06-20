#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

fail() {
  echo "Upstream staging preflight failed: $1" >&2
  exit 1
}

warn() {
  echo "Upstream staging preflight warning: $1" >&2
}

as_bool() {
  case "${1:-false}" in
    true|TRUE|1|yes|YES) echo "true" ;;
    *) echo "false" ;;
  esac
}

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "$cmd is required."
  fi
}

require_file() {
  local path="$1"
  if [ ! -f "$path" ]; then
    fail "Missing required file: $path"
  fi
}

require_value() {
  local key="$1"
  local value="${!key:-}"
  if [ -z "$value" ]; then
    fail "$key must be set in $ENV_FILE."
  fi
}

require_non_placeholder() {
  local key="$1"
  local value="${!key:-}"

  require_value "$key"

  case "$value" in
    *replace_with*|*your-domain*|*example*|postgres|password|changeme)
      fail "$key still looks like a placeholder in $ENV_FILE."
      ;;
  esac
}

require_exact_bool() {
  local key="$1"
  local expected="$2"
  local actual
  actual="$(as_bool "${!key:-}")"

  if [ "$actual" != "$expected" ]; then
    fail "$key must be $expected for upstream staging, got '${!key:-unset}'."
  fi
}

require_exact_value_lower() {
  local key="$1"
  local expected="$2"
  local actual="${!key:-}"

  if [ -z "$actual" ]; then
    fail "$key must be set to $expected in $ENV_FILE."
  fi

  actual="$(echo "$actual" | tr '[:upper:]' '[:lower:]')"
  expected="$(echo "$expected" | tr '[:upper:]' '[:lower:]')"

  if [ "$actual" != "$expected" ]; then
    fail "$key must be $expected for upstream staging, got '${!key:-unset}'."
  fi
}

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env.fuse-staging}"
ALLOW_HTTP_STAGING="$(as_bool "${ALLOW_HTTP_STAGING:-false}")"
ALLOW_PARTNER_OS_IMAGE_TAG="$(as_bool "${ALLOW_PARTNER_OS_IMAGE_TAG:-false}")"
ALLOW_AWS_ROOT_PRINCIPAL="$(as_bool "${ALLOW_AWS_ROOT_PRINCIPAL:-false}")"
CHECK_AWS_IDENTITY="$(as_bool "${CHECK_AWS_IDENTITY:-true}")"
RUN_APP_VALIDATORS="$(as_bool "${RUN_APP_VALIDATORS:-true}")"
CHECK_DOCKER="$(as_bool "${CHECK_DOCKER:-true}")"

require_file "$ENV_FILE"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

require_cmd curl

if [ "$CHECK_DOCKER" = "true" ]; then
  require_cmd docker
  docker version --format '{{.Server.Version}}' >/dev/null 2>&1 ||
    fail "Docker daemon is not reachable."
  docker compose version >/dev/null 2>&1 ||
    fail "Docker Compose plugin is required."
  docker buildx version >/dev/null 2>&1 ||
    fail "Docker buildx plugin is required."
fi

if [ "$CHECK_AWS_IDENTITY" = "true" ]; then
  require_cmd aws
  if ! AWS_ARN="$(aws sts get-caller-identity --query Arn --output text 2>&1)"; then
    fail "Unable to read AWS caller identity: $AWS_ARN"
  fi

  if [[ "$AWS_ARN" == *":root" ]] && [ "$ALLOW_AWS_ROOT_PRINCIPAL" != "true" ]; then
    fail "AWS caller is the root principal. Create/use a staging deploy IAM role before mutating infra."
  fi
fi

require_non_placeholder TWENTY_IMAGE
require_non_placeholder SERVER_URL
require_non_placeholder APP_SECRET
require_non_placeholder PG_DATABASE_PASSWORD

if [[ "$SERVER_URL" != https://* ]] && [ "$ALLOW_HTTP_STAGING" != "true" ]; then
  fail "SERVER_URL must use https for staging."
fi

if [[ "$TWENTY_IMAGE" == *":partner-os-"* ]] && [ "$ALLOW_PARTNER_OS_IMAGE_TAG" != "true" ]; then
  fail "TWENTY_IMAGE uses the legacy partner-os tag path. Use fuse-upstream-staging-<sha>."
fi

if [ -n "${WORKSPACE_ID:-}" ]; then
  fail "WORKSPACE_ID is set. Partner app schema should be installed through Twenty apps, not the deploy script."
fi

require_exact_bool IS_MULTIWORKSPACE_ENABLED true
require_exact_bool VERIFY_PUBLIC_URL true
require_exact_bool IS_CONFIG_VARIABLES_IN_DB_ENABLED false
require_exact_bool TELEMETRY_ENABLED false
require_exact_bool ANALYTICS_ENABLED false
require_exact_bool AI_TELEMETRY_ENABLED false
require_exact_bool ALLOW_REQUESTS_TO_TWENTY_ICONS false
require_exact_bool COMPANY_ENRICHMENT_ENABLED false
require_exact_value_lower COMPANY_ENRICHMENT_PROVIDER none
require_exact_bool MARKETPLACE_REMOTE_FETCH_ENABLED false
require_exact_bool ADMIN_VERSION_CHECK_ENABLED false
require_exact_bool HELP_CENTER_SEARCH_ENABLED false
require_exact_value_lower HELP_CENTER_SEARCH_PROVIDER none
require_exact_value_lower SUPPORT_DRIVER none

case "${STORAGE_TYPE:-local}" in
  local)
    warn "STORAGE_TYPE=local. Acceptable for first staging boot only; use s3 before production cutover."
    ;;
  s3)
    require_value STORAGE_S3_REGION
    require_value STORAGE_S3_NAME
    ;;
  *)
    fail "STORAGE_TYPE must be local or s3, got '${STORAGE_TYPE:-unset}'."
    ;;
esac

if [ "$(as_bool "${AUTH_GOOGLE_ENABLED:-false}")" = "true" ]; then
  require_value AUTH_GOOGLE_CLIENT_ID
  require_value AUTH_GOOGLE_CLIENT_SECRET
  require_value AUTH_GOOGLE_CALLBACK_URL
fi

if [ "$(as_bool "${AUTH_MICROSOFT_ENABLED:-false}")" = "true" ]; then
  require_value AUTH_MICROSOFT_CLIENT_ID
  require_value AUTH_MICROSOFT_CLIENT_SECRET
  require_value AUTH_MICROSOFT_CALLBACK_URL
fi

if [ "$RUN_APP_VALIDATORS" = "true" ]; then
  require_cmd git
  require_cmd yarn

  require_file packages/twenty-apps/internal/fuse-partner-core/package.json
  require_file packages/twenty-apps/internal/fuse-agency-partner-program/package.json

  yarn fuse:partner-core:validate
  yarn fuse:agency-partner:validate
else
  warn "Skipping Fuse app package validation (RUN_APP_VALIDATORS=false). Run validators in repo CI before deploy."
fi

echo "Upstream staging preflight passed (env=$ENV_FILE)"
echo "No Partner OS bootstrap variables detected."
