#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$REPO_ROOT"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

IMAGE_REPO="${IMAGE_REPO:-fuse-v1-local}"
IMAGE_TAG="${IMAGE_TAG:-partner-os-$(git rev-parse --short HEAD)}"
WRITE_ENV_FILE="${WRITE_ENV_FILE:-}"

host_arch="$(uname -m)"
case "$host_arch" in
  arm64|aarch64) DEFAULT_PLATFORM="linux/arm64" ;;
  x86_64|amd64) DEFAULT_PLATFORM="linux/amd64" ;;
  *) DEFAULT_PLATFORM="linux/amd64" ;;
esac

PLATFORM="${PLATFORM:-$DEFAULT_PLATFORM}"
IMAGE_REF="${IMAGE_REPO}:${IMAGE_TAG}"

MODE=local \
IMAGE_REF="$IMAGE_REF" \
PLATFORM="$PLATFORM" \
CHECK_IMAGE_EXISTS=false \
CHECK_BUILD_RESOURCES=false \
bash "${SCRIPT_DIR}/fuse-deploy-preflight.sh"

echo "Building local image ${IMAGE_REF} (${PLATFORM})"
docker buildx build \
  --platform "${PLATFORM}" \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t "${IMAGE_REF}" \
  --load .

if [ -n "${WRITE_ENV_FILE}" ]; then
  if [ ! -f "$WRITE_ENV_FILE" ]; then
    echo "WRITE_ENV_FILE does not exist: ${WRITE_ENV_FILE}" >&2
    exit 1
  fi

  tmp_file="$(mktemp)"
  awk -v image_ref="$IMAGE_REF" '
    BEGIN { updated = 0 }
    /^TWENTY_IMAGE=/ {
      print "TWENTY_IMAGE=" image_ref
      updated = 1
      next
    }
    { print }
    END {
      if (updated == 0) {
        print "TWENTY_IMAGE=" image_ref
      }
    }
  ' "$WRITE_ENV_FILE" > "$tmp_file"
  mv "$tmp_file" "$WRITE_ENV_FILE"
  echo "Updated ${WRITE_ENV_FILE} with TWENTY_IMAGE=${IMAGE_REF}"
fi

echo "IMAGE_REF=${IMAGE_REF}"
