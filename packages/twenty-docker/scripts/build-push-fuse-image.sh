#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
SCRIPT_DIR="${SELF_DIR}"
cd "$REPO_ROOT"

IMAGE_REPO="${IMAGE_REPO:-ghcr.io/fuse-gtm/fuse-v1}"
IMAGE_TAG="${IMAGE_TAG:-partner-os-$(git rev-parse --short HEAD)}"
PLATFORM="${PLATFORM:-linux/amd64}"
VERIFY_IMAGE_EXISTS="${VERIFY_IMAGE_EXISTS:-true}"
WRITE_ENV_FILE="${WRITE_ENV_FILE:-}"

IMAGE_REF="${IMAGE_REPO}:${IMAGE_TAG}"

MODE=prod \
IMAGE_REF="$IMAGE_REF" \
PLATFORM="$PLATFORM" \
CHECK_IMAGE_EXISTS=false \
CHECK_BUILD_RESOURCES=true \
bash "${SCRIPT_DIR}/fuse-deploy-preflight.sh"

echo "Building and pushing ${IMAGE_REF}"
docker buildx build \
  --platform "${PLATFORM}" \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t "${IMAGE_REF}" \
  --push .

if [ "${VERIFY_IMAGE_EXISTS}" = "true" ]; then
  MODE=prod \
  IMAGE_REF="$IMAGE_REF" \
  CHECK_IMAGE_EXISTS=true \
  CHECK_BUILD_RESOURCES=false \
  bash "${SCRIPT_DIR}/fuse-deploy-preflight.sh"
fi

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
