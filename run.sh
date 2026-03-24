#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
APP_DIR="$ROOT_DIR/apps/api"
ROOT_ENV_FILE="$ROOT_DIR/.env"
APP_ENV_FILE="$APP_DIR/.env"
ROOT_DOCKER_ENV_FILE=""
APP_DOCKER_ENV_FILE=""

IMAGE_NAME="farm-flow-api:latest"
NETWORK_NAME="farm-flow_farm-flow"
SERVICE_ALIAS="farm-flow-api"

CONTAINER_BLUE="${SERVICE_ALIAS}-blue"
CONTAINER_GREEN="${SERVICE_ALIAS}-green"

STAGE_BLUE="${CONTAINER_BLUE}-stage"
STAGE_GREEN="${CONTAINER_GREEN}-stage"

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

get_active_color() {
  if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_BLUE"; then
    echo blue
    return
  fi

  if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_GREEN"; then
    echo green
    return
  fi

  echo none
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

container_running() {
  NAME="$1"
  docker ps --format '{{.Names}}' | grep -qx "$NAME"
}

remove_container_if_exists() {
  NAME="$1"

  if container_exists "$NAME"; then
    docker stop -t 10 "$NAME" >/dev/null 2>&1 || true
    docker rm "$NAME" >/dev/null 2>&1 || true
  fi
}

wait_for_health() {
  NAME="$1"

  echo "[INFO] waiting for container to become healthy: $NAME"

  HEALTHCHECK=$(docker inspect --format='{{if .Config.Healthcheck}}yes{{else}}no{{end}}' "$NAME")

  if [ "$HEALTHCHECK" = "yes" ]; then
    i=0
    while [ "$i" -lt 30 ]; do
      STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$NAME")

      if [ "$STATUS" = "healthy" ]; then
        echo "[INFO] container is healthy: $NAME"
        return 0
      fi

      if [ "$STATUS" = "unhealthy" ]; then
        echo "[ERROR] container is unhealthy: $NAME"
        docker logs "$NAME" || true
        return 1
      fi

      sleep 2
      i=$((i + 1))
    done

    echo "[ERROR] health check timeout: $NAME"
    docker logs "$NAME" || true
    return 1
  fi

  echo "[WARN] no HEALTHCHECK found, waiting 10 seconds: $NAME"
  sleep 10
  return 0
}

run_stage_container() {
  NAME="$1"

  echo "[INFO] starting stage container: $NAME"

  docker run -d \
    --name "$NAME" \
    --env-file "$ROOT_DOCKER_ENV_FILE" \
    --env-file "$APP_DOCKER_ENV_FILE" \
    --network "$NETWORK_NAME" \
    --restart unless-stopped \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    "$IMAGE_NAME" >/dev/null
}

run_live_container() {
  NAME="$1"

  echo "[INFO] starting live container with alias: $NAME"

  docker run -d \
    --name "$NAME" \
    --env-file "$ROOT_DOCKER_ENV_FILE" \
    --env-file "$APP_DOCKER_ENV_FILE" \
    --network "$NETWORK_NAME" \
    --network-alias "$SERVICE_ALIAS" \
    --restart unless-stopped \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    "$IMAGE_NAME" >/dev/null
}

verify_alias() {
  NAME="$1"

  echo "[INFO] verifying alias on container: $NAME"
  docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{printf "%s -> %v\n" $k $v.Aliases}}{{end}}' "$NAME"

  if ! docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if eq $k "'"$NETWORK_NAME"'"}}{{range $v.Aliases}}{{println .}}{{end}}{{end}}{{end}}' "$NAME" | grep -qx "$SERVICE_ALIAS"; then
    echo "[ERROR] alias not attached: $SERVICE_ALIAS"
    return 1
  fi

  return 0
}

cleanup_unused_images() {
  docker images "farm-flow-api" --format "{{.Repository}}:{{.Tag}}" \
  | grep -v ":latest$" \
  | while read -r image; do
      if ! docker ps --format "{{.Image}}" | grep -q "^${image}\$"; then
        docker rmi "$image" >/dev/null 2>&1 || true
      fi
    done
}

require_env_file "$ROOT_ENV_FILE"
require_env_file "$APP_ENV_FILE"

ROOT_DOCKER_ENV_FILE=$(mktemp)
APP_DOCKER_ENV_FILE=$(mktemp)
trap cleanup_temp_env_files EXIT

prepare_docker_env_file "$ROOT_ENV_FILE" "$ROOT_DOCKER_ENV_FILE"
prepare_docker_env_file "$APP_ENV_FILE" "$APP_DOCKER_ENV_FILE"

ensure_network

ACTIVE_COLOR=$(get_active_color)

if [ "$ACTIVE_COLOR" = "blue" ]; then
  NEXT_COLOR="green"
  OLD_CONTAINER="$CONTAINER_BLUE"
  NEW_CONTAINER="$CONTAINER_GREEN"
  STAGE_CONTAINER="$STAGE_GREEN"
elif [ "$ACTIVE_COLOR" = "green" ]; then
  NEXT_COLOR="blue"
  OLD_CONTAINER="$CONTAINER_GREEN"
  NEW_CONTAINER="$CONTAINER_BLUE"
  STAGE_CONTAINER="$STAGE_BLUE"
else
  NEXT_COLOR="blue"
  OLD_CONTAINER=""
  NEW_CONTAINER="$CONTAINER_BLUE"
  STAGE_CONTAINER="$STAGE_BLUE"
fi

echo "[INFO] active color: $ACTIVE_COLOR"
echo "[INFO] next color: $NEXT_COLOR"
echo "[INFO] old container: ${OLD_CONTAINER:-none}"
echo "[INFO] stage container: $STAGE_CONTAINER"
echo "[INFO] new live container: $NEW_CONTAINER"

remove_container_if_exists "$STAGE_CONTAINER"
remove_container_if_exists "$NEW_CONTAINER"

run_stage_container "$STAGE_CONTAINER"

if ! wait_for_health "$STAGE_CONTAINER"; then
  echo "[ERROR] stage health check failed"
  remove_container_if_exists "$STAGE_CONTAINER"
  exit 1
fi

echo "[INFO] stage health check passed: $STAGE_CONTAINER"

echo "[INFO] removing stage container: $STAGE_CONTAINER"
remove_container_if_exists "$STAGE_CONTAINER"

echo "[INFO] removing target live container if exists: $NEW_CONTAINER"
remove_container_if_exists "$NEW_CONTAINER"

run_live_container "$NEW_CONTAINER"

if ! wait_for_health "$NEW_CONTAINER"; then
  echo "[ERROR] new live container health check failed"
  docker logs "$NEW_CONTAINER" || true
  exit 1
fi

if ! verify_alias "$NEW_CONTAINER"; then
  docker logs "$NEW_CONTAINER" || true
  exit 1
fi

if [ -n "$OLD_CONTAINER" ] && container_running "$OLD_CONTAINER"; then
  echo "[INFO] stopping old container: $OLD_CONTAINER"
  docker stop -t 10 "$OLD_CONTAINER" >/dev/null 2>&1 || true
  docker rm "$OLD_CONTAINER" >/dev/null 2>&1 || true
fi

cleanup_unused_images

echo "[INFO] deploy completed: active=$NEXT_COLOR"
echo "[INFO] active container: $NEW_CONTAINER"
