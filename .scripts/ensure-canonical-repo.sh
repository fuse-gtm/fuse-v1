#!/usr/bin/env bash
set -euo pipefail

CANONICAL_REPO_PATH="${CANONICAL_REPO_PATH:-/Users/dhruvraina/fuse-platform}"
QUIET="false"
SOFT="false"

usage() {
  cat <<'USAGE'
Usage: ensure-canonical-repo.sh [--quiet] [--soft]
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --quiet) QUIET="true" ;;
    --soft) SOFT="true" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage >&2; exit 2 ;;
  esac
done

if ! CURRENT_REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  MESSAGE="Not inside a git repository. Canonical repo: ${CANONICAL_REPO_PATH}"
  [ "$SOFT" = "true" ] && { echo "WARN: ${MESSAGE}" >&2; exit 0; }
  echo "ERROR: ${MESSAGE}" >&2
  exit 1
fi

if [ "$CURRENT_REPO_ROOT" != "$CANONICAL_REPO_PATH" ]; then
  MESSAGE="Wrong repository.
  current:  ${CURRENT_REPO_ROOT}
  expected: ${CANONICAL_REPO_PATH}
Use: cd ${CANONICAL_REPO_PATH}"
  [ "$SOFT" = "true" ] && { echo "WARN: ${MESSAGE}" >&2; exit 0; }
  echo "ERROR: ${MESSAGE}" >&2
  exit 1
fi

[ "$QUIET" = "true" ] || echo "OK: canonical repo verified (${CURRENT_REPO_ROOT})"
