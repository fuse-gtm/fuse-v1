#!/usr/bin/env bash
set -euo pipefail

# Exit codes
# 2: missing runtime/tooling
# 3: registry auth issue
# 4: image missing
# 5: unsafe build mode for local host constraints

fail() {
  local code="$1"
  local message="$2"
  echo "Preflight failed (${code}): ${message}" >&2
  exit "$code"
}

warn() {
  local message="$1"
  echo "Preflight warning: ${message}" >&2
}

require_cmd() {
  local cmd="$1"
  local message="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail 2 "$message"
  fi
}

run_with_timeout() {
  local seconds="$1"
  shift
  "$@" &
  local command_pid="$!"

  (
    sleep "$seconds"
    if kill -0 "$command_pid" >/dev/null 2>&1; then
      kill "$command_pid" >/dev/null 2>&1 || true
      sleep 2
      if kill -0 "$command_pid" >/dev/null 2>&1; then
        kill -9 "$command_pid" >/dev/null 2>&1 || true
      fi
    fi
  ) &
  local killer_pid="$!"

  local command_code=0
  wait "$command_pid" || command_code="$?"
  kill "$killer_pid" >/dev/null 2>&1 || true
  wait "$killer_pid" >/dev/null 2>&1 || true

  return "$command_code"
}

as_bool() {
  case "${1:-false}" in
    true|TRUE|1|yes|YES) echo "true" ;;
    *) echo "false" ;;
  esac
}

is_arm_host() {
  local arch
  arch="$(uname -m)"
  case "$arch" in
    arm64|aarch64) return 0 ;;
    *) return 1 ;;
  esac
}

detect_mem_gb() {
  if command -v sysctl >/dev/null 2>&1; then
    local bytes
    bytes="$(sysctl -n hw.memsize 2>/dev/null || true)"
    if [ -n "${bytes}" ]; then
      echo $((bytes / 1024 / 1024 / 1024))
      return
    fi
  fi

  if [ -r /proc/meminfo ]; then
    local kb
    kb="$(awk '/MemTotal:/ {print $2}' /proc/meminfo)"
    if [ -n "${kb}" ]; then
      echo $((kb / 1024 / 1024))
      return
    fi
  fi

  echo 0
}

check_docker_credentials_helper() {
  local config_path="${DOCKER_CONFIG:-$HOME/.docker}/config.json"

  if [ ! -f "$config_path" ]; then
    return
  fi

  local creds_store
  creds_store="$(sed -n 's/.*"credsStore"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$config_path" | head -n 1)"

  if [ -z "${creds_store}" ]; then
    return
  fi

  local helper="docker-credential-${creds_store}"
  if ! command -v "$helper" >/dev/null 2>&1; then
    fail 2 "Docker credsStore '${creds_store}' is configured but '${helper}' is not installed. Remove or fix credsStore in ${config_path}."
  fi
}

classify_manifest_error() {
  local message="$1"
  if echo "$message" | grep -Eiq "unauthorized|denied|authentication required|insufficient_scope|requested access to the resource is denied"; then
    echo "auth"
    return
  fi
  if echo "$message" | grep -Eiq "manifest unknown|not found|no such manifest"; then
    echo "missing"
    return
  fi
  echo "unknown"
}

check_registry_image_exists() {
  local image_ref="$1"

  if [ -z "$image_ref" ]; then
    fail 4 "IMAGE_REF is required for image existence checks."
  fi

  local output
  if output="$(docker manifest inspect "$image_ref" 2>&1)"; then
    return
  fi

  case "$(classify_manifest_error "$output")" in
    auth)
      fail 3 "Cannot access image '${image_ref}' (auth denied). Login first (docker login ghcr.io) with read:packages scope."
      ;;
    missing)
      fail 4 "Image '${image_ref}' does not exist in registry (manifest not found)."
      ;;
    *)
      fail 3 "Unable to inspect '${image_ref}': ${output}"
      ;;
  esac
}

check_local_image_exists() {
  local image_ref="$1"
  if [ -z "$image_ref" ]; then
    fail 4 "IMAGE_REF is required for local image existence checks."
  fi
  if ! docker image inspect "$image_ref" >/dev/null 2>&1; then
    fail 4 "Local image '${image_ref}' was not found in the local Docker daemon."
  fi
}

check_registry_auth() {
  local image_ref="$1"
  if [ -z "$image_ref" ]; then
    fail 3 "IMAGE_REF is required for registry auth checks."
  fi

  case "$image_ref" in
    ghcr.io/*) ;;
    *) return ;;
  esac

  local repo
  repo="$(echo "$image_ref" | cut -d: -f1)"
  local auth_probe_ref="${repo}:__authcheck__"
  local output
  if output="$(docker manifest inspect "$auth_probe_ref" 2>&1)"; then
    return
  fi

  case "$(classify_manifest_error "$output")" in
    auth)
      fail 3 "Registry auth failed for ghcr.io. Login with 'docker login ghcr.io' using a token with read:packages."
      ;;
    missing)
      # Missing manifest on auth probe means auth is valid enough to query metadata.
      return
      ;;
    *)
      warn "Non-fatal registry auth probe output: ${output}"
      ;;
  esac
}

MODE="${MODE:-local}"
ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
IMAGE_REF="${IMAGE_REF:-${TWENTY_IMAGE:-}}"
PLATFORM="${PLATFORM:-linux/amd64}"
CHECK_IMAGE_EXISTS="$(as_bool "${CHECK_IMAGE_EXISTS:-true}")"
CHECK_LOCAL_IMAGE_EXISTS="$(as_bool "${CHECK_LOCAL_IMAGE_EXISTS:-false}")"
CHECK_BUILD_RESOURCES="$(as_bool "${CHECK_BUILD_RESOURCES:-false}")"
DOCKER_TIMEOUT_SECONDS="${DOCKER_TIMEOUT_SECONDS:-15}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  if [ -z "${IMAGE_REF}" ] && [ -n "${TWENTY_IMAGE:-}" ]; then
    IMAGE_REF="$TWENTY_IMAGE"
  fi
fi

require_cmd docker "docker is required."
if ! run_with_timeout "$DOCKER_TIMEOUT_SECONDS" docker version --format '{{.Server.Version}}' >/dev/null 2>&1; then
  fail 2 "Docker daemon is not reachable. Start Docker/Colima first."
fi

if ! docker compose version >/dev/null 2>&1; then
  fail 2 "Docker Compose plugin is required (docker compose)."
fi

if ! docker buildx version >/dev/null 2>&1; then
  fail 2 "Docker buildx plugin is required (docker buildx)."
fi

check_docker_credentials_helper

if [ "$CHECK_BUILD_RESOURCES" = "true" ] && is_arm_host && [ "$PLATFORM" = "linux/amd64" ]; then
  mem_gb="$(detect_mem_gb)"
  if [ "$mem_gb" -le 8 ]; then
    fail 5 "Host is arm64 with ${mem_gb}GB RAM building ${PLATFORM}. This is frequently OOM-prone. Use CI image build workflow (.github/workflows/fuse-image-build.yml)."
  fi
  warn "arm64 host building ${PLATFORM}; emulation may be slow. Prefer CI for production images."
fi

if [ "$MODE" = "prod" ]; then
  check_registry_auth "$IMAGE_REF"
fi

if [ "$MODE" = "prod" ] && [ "$CHECK_IMAGE_EXISTS" = "true" ]; then
  check_registry_image_exists "$IMAGE_REF"
fi

if [ "$MODE" = "local" ] && [ "$CHECK_LOCAL_IMAGE_EXISTS" = "true" ]; then
  check_local_image_exists "$IMAGE_REF"
fi

echo "Preflight passed (mode=${MODE})"
