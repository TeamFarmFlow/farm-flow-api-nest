#!/bin/sh

set -eu

timestamp=$(date +%s)

APP_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/../.." && pwd)

docker buildx build \
  -f "$APP_DIR/Dockerfile" \
  -t farm-flow-worker:latest \
  -t farm-flow-worker:$timestamp \
  --load \
  "$ROOT_DIR"
