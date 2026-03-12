#!/bin/sh

set -eu

IMAGE_NAME="farm-flow-api:latest"

SERVICE_NETWORK="farm-flow_farm-flow"
STAGE_NETWORK="farm-flow_stage"
SERVICE_ALIAS="farm-flow-api"

CONTAINER_BLUE="${SERVICE_ALIAS}-blue"
CONTAINER_GREEN="${SERVICE_ALIAS}-green"

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
  NETWORK="$1"

  if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
    docker network create "$NETWORK" >/dev/null
    echo "[INFO] created network: $NETWORK"
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

disconnect_from_network_if_connected() {
  NETWORK="$1"
  NAME="$2"

  if docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' "$NAME" 2>/dev/null | grep -qx "$NETWORK"; then
    docker network disconnect "$NETWORK" "$NAME" >/dev/null 2>&1 || true
  fi
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

  echo "[INFO] waiting for new container to become healthy..."

  HEALTHCHECK=$(docker inspect --format='{{if .Config.Healthcheck}}yes{{else}}no{{end}}' "$NAME")

  if [ "$HEALTHCHECK" = "yes" ]; then
    i=0
    while [ "$i" -lt 30 ]; do
      STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$NAME")

      if [ "$STATUS" = "healthy" ]; then
        echo "[INFO] new container is healthy"
        return 0
      fi

      if [ "$STATUS" = "unhealthy" ]; then
        echo "[ERROR] new container is unhealthy"
        docker logs "$NAME" || true
        return 1
      fi

      sleep 2
      i=$((i + 1))
    done

    echo "[ERROR] health check timeout"
    docker logs "$NAME" || true
    return 1
  fi

  echo "[WARN] no HEALTHCHECK found, waiting 10 seconds"
  sleep 10
  return 0
}

ensure_network "$SERVICE_NETWORK"
ensure_network "$STAGE_NETWORK"

ACTIVE_COLOR=$(get_active_color)

if [ "$ACTIVE_COLOR" = "blue" ]; then
  NEXT_COLOR="green"
  OLD_CONTAINER="$CONTAINER_BLUE"
  NEW_CONTAINER="$CONTAINER_GREEN"
elif [ "$ACTIVE_COLOR" = "green" ]; then
  NEXT_COLOR="blue"
  OLD_CONTAINER="$CONTAINER_GREEN"
  NEW_CONTAINER="$CONTAINER_BLUE"
else
  NEXT_COLOR="blue"
  OLD_CONTAINER=""
  NEW_CONTAINER="$CONTAINER_BLUE"
fi

echo "[INFO] active color: $ACTIVE_COLOR"
echo "[INFO] next color: $NEXT_COLOR"
echo "[INFO] old container: ${OLD_CONTAINER:-none}"
echo "[INFO] new container: $NEW_CONTAINER"

remove_container_if_exists "$NEW_CONTAINER"

echo "[INFO] starting new container on stage network: $STAGE_NETWORK"

docker run -d \
  --name "$NEW_CONTAINER" \
  --network "$STAGE_NETWORK" \
  --restart unless-stopped \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  "$IMAGE_NAME" >/dev/null

if ! wait_for_health "$NEW_CONTAINER"; then
  echo "[ERROR] deployment aborted"
  exit 1
fi

if [ -n "$OLD_CONTAINER" ] && container_running "$OLD_CONTAINER"; then
  echo "[INFO] stopping old container before switching alias: $OLD_CONTAINER"
  docker stop -t 10 "$OLD_CONTAINER" >/dev/null 2>&1 || true
  docker rm "$OLD_CONTAINER" >/dev/null 2>&1 || true
fi

echo "[INFO] connecting new container to service network with alias: $SERVICE_ALIAS"

docker network connect --alias "$SERVICE_ALIAS" "$SERVICE_NETWORK" "$NEW_CONTAINER"

echo "[INFO] verifying service alias resolution"

if ! docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if eq $k "'"$SERVICE_NETWORK"'"}}{{printf "%v" $v.Aliases}}{{end}}{{end}}' "$NEW_CONTAINER" | grep -q "$SERVICE_ALIAS"; then
  echo "[ERROR] failed to attach service alias: $SERVICE_ALIAS"
  docker logs "$NEW_CONTAINER" || true
  exit 1
fi

echo "[INFO] optionally disconnecting new container from stage network"

disconnect_from_network_if_connected "$STAGE_NETWORK" "$NEW_CONTAINER"

docker images "farm-flow-api" --format "{{.Repository}}:{{.Tag}}" \
| grep -v ":latest$" \
| while read -r image; do
    if ! docker ps --format "{{.Image}}" | grep -q "^${image}\$"; then
      docker rmi "$image" >/dev/null 2>&1 || true
    fi
  done

echo "[INFO] deploy completed: active=$NEXT_COLOR"
echo "[INFO] active container: $NEW_CONTAINER"