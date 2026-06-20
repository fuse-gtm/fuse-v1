#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
EXPECTED_BASE_URL="${EXPECTED_BASE_URL:-https://app.fusegtm.com}"
CHECK_PROVIDERS="${CHECK_PROVIDERS:-both}"

usage() {
  cat <<'EOF'
Usage:
  ENV_FILE=packages/twenty-docker/.env \
  EXPECTED_BASE_URL=https://app.fusegtm.com \
  CHECK_PROVIDERS=both \
  bash packages/twenty-docker/scripts/fuse-oauth-readiness-check.sh

Checks:
  - Required Google/Microsoft OAuth env vars exist
  - OAuth provider flags are enabled
  - Callback URLs match EXPECTED_BASE_URL

Modes:
  CHECK_PROVIDERS=both      # default
  CHECK_PROVIDERS=google    # ignore Microsoft checks
  CHECK_PROVIDERS=microsoft # ignore Google checks

Exit codes:
  0 = ready
  1 = missing/invalid configuration
EOF
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

missing=0

check_non_empty() {
  local key="$1"
  local value="${!key:-}"
  if [ -z "$value" ]; then
    echo "FAIL: ${key} is empty"
    missing=1
    return
  fi
  if [[ "$value" == replace_with_* ]]; then
    echo "FAIL: ${key} still has placeholder value"
    missing=1
    return
  fi
  echo "PASS: ${key} is set"
}

check_equals() {
  local key="$1"
  local expected="$2"
  local value="${!key:-}"
  if [ "$value" != "$expected" ]; then
    echo "FAIL: ${key} mismatch"
    echo "  expected: $expected"
    echo "  actual:   ${value:-<empty>}"
    missing=1
    return
  fi
  echo "PASS: ${key} matches expected callback"
}

check_true() {
  local key="$1"
  local value="${!key:-false}"
  case "$value" in
    true|TRUE|1|yes|YES)
      echo "PASS: ${key}=true"
      ;;
    *)
      echo "FAIL: ${key} must be true (actual: $value)"
      missing=1
      ;;
  esac
}

echo "OAuth readiness check"
echo "Env file: $ENV_FILE"
echo "Expected base URL: $EXPECTED_BASE_URL"
echo "Check providers: $CHECK_PROVIDERS"
echo

case "$CHECK_PROVIDERS" in
  both|google|microsoft)
    ;;
  *)
    echo "Invalid CHECK_PROVIDERS value: $CHECK_PROVIDERS" >&2
    echo "Expected: both, google, or microsoft" >&2
    exit 1
    ;;
esac

if [ "$CHECK_PROVIDERS" = "both" ] || [ "$CHECK_PROVIDERS" = "google" ]; then
  check_true "AUTH_GOOGLE_ENABLED"
  check_non_empty "AUTH_GOOGLE_CLIENT_ID"
  check_non_empty "AUTH_GOOGLE_CLIENT_SECRET"
  check_equals "AUTH_GOOGLE_CALLBACK_URL" "${EXPECTED_BASE_URL}/auth/google/redirect"
  check_equals "AUTH_GOOGLE_APIS_CALLBACK_URL" "${EXPECTED_BASE_URL}/auth/google-apis/get-access-token"
  echo
fi

if [ "$CHECK_PROVIDERS" = "both" ] || [ "$CHECK_PROVIDERS" = "microsoft" ]; then
  check_true "AUTH_MICROSOFT_ENABLED"
  check_non_empty "AUTH_MICROSOFT_CLIENT_ID"
  check_non_empty "AUTH_MICROSOFT_CLIENT_SECRET"
  check_equals "AUTH_MICROSOFT_CALLBACK_URL" "${EXPECTED_BASE_URL}/auth/microsoft/redirect"
  check_equals "AUTH_MICROSOFT_APIS_CALLBACK_URL" "${EXPECTED_BASE_URL}/auth/microsoft-apis/get-access-token"
  echo
fi

if [ "$missing" -ne 0 ]; then
  echo "OAuth readiness check failed."
  exit 1
fi

echo "OAuth readiness check passed."
