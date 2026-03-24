#!/bin/sh

set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/../.." && pwd)
ROOT_ENV_FILE="$ROOT_DIR/.env"
APP_ENV_FILE="$APP_DIR/.env"
ROOT_DOCKER_ENV_FILE=""
APP_DOCKER_ENV_FILE=""

IMAGE_NAME="farm-flow-migration:latest"
CONTAINER_NAME="farm-flow-migration-run"
NETWORK_NAME="farm-flow_farm-flow"

require_env_file() {
  FILE_PATH="$1"

  if [ ! -f "$FILE_PATH" ]; then
    echo "[ERROR] env file not found: $FILE_PATH"
    exit 1
  fi
}

prepare_docker_env_file() {
  SOURCE_FILE="$1"
  TARGET_FILE="$2"

  sed -E 's/^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$/\1=\2/' "$SOURCE_FILE" >"$TARGET_FILE"
}

cleanup_temp_env_files() {
  if [ -n "$ROOT_DOCKER_ENV_FILE" ] && [ -f "$ROOT_DOCKER_ENV_FILE" ]; then
    rm -f "$ROOT_DOCKER_ENV_FILE"
  fi

  if [ -n "$APP_DOCKER_ENV_FILE" ] && [ -f "$APP_DOCKER_ENV_FILE" ]; then
    rm -f "$APP_DOCKER_ENV_FILE"
  fi
}

ensure_network() {
  if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
    docker network create "$NETWORK_NAME" >/dev/null
    echo "[INFO] created network: $NETWORK_NAME"
  fi
}

container_exists() {
  NAME="$1"
  docker ps -a --format '{{.Names}}' | grep -qx "$NAME"
}

remove_container_if_exists() {
  NAME="$1"

  if container_exists "$NAME"; then
    docker rm -f "$NAME" >/dev/null 2>&1 || true
  fi
}

require_env_file "$ROOT_ENV_FILE"
require_env_file "$APP_ENV_FILE"

ROOT_DOCKER_ENV_FILE=$(mktemp)
APP_DOCKER_ENV_FILE=$(mktemp)
trap cleanup_temp_env_files EXIT

prepare_docker_env_file "$ROOT_ENV_FILE" "$ROOT_DOCKER_ENV_FILE"
prepare_docker_env_file "$APP_ENV_FILE" "$APP_DOCKER_ENV_FILE"

ensure_network
remove_container_if_exists "$CONTAINER_NAME"

echo "[INFO] starting migration container: $CONTAINER_NAME"

docker run --rm \
  --name "$CONTAINER_NAME" \
  --env-file "$ROOT_DOCKER_ENV_FILE" \
  --env-file "$APP_DOCKER_ENV_FILE" \
  --network "$NETWORK_NAME" \
  "$IMAGE_NAME"

echo "[INFO] migration completed"
