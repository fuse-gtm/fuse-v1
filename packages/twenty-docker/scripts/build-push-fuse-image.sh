#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$REPO_ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

IMAGE_REPO="${IMAGE_REPO:-ghcr.io/fuse-gtm/fuse-v1}"
IMAGE_TAG="${IMAGE_TAG:-partner-os-$(git rev-parse --short HEAD)}"
PLATFORM="${PLATFORM:-linux/amd64}"

IMAGE_REF="${IMAGE_REPO}:${IMAGE_TAG}"

echo "Building and pushing ${IMAGE_REF}"
docker buildx build \
  --platform "${PLATFORM}" \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t "${IMAGE_REF}" \
  --push .

echo "IMAGE_REF=${IMAGE_REF}"
