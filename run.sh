IMAGE_NAME="farm-flow-api:latest"
NETWORK_NAME=farm-flow_farm-flow
SERVICE_ALIAS=farm-flow-api

CONTAINER_BLUE="${SERVICE_ALIAS}-blue"
CONTAINER_GREEN="${SERVICE_ALIAS}-green"

get_active_color() {
  if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_BLUE"; then
    echo "blue"
    return
  fi

  if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_GREEN"; then
    echo "green"
    return
  fi

  echo "none"
}

if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  docker network create "$NETWORK_NAME"
fi

ACTIVE_COLOR="$(get_active_color)"

if [ "$ACTIVE_COLOR" = "blue" ]; then
  NEXT_COLOR="green"
  OLD_CONTAINER="$BLUE_CONTAINER"
  NEW_CONTAINER="$GREEN_CONTAINER"
elif [ "$ACTIVE_COLOR" = "green" ]; then
  NEXT_COLOR="blue"
  OLD_CONTAINER="$GREEN_CONTAINER"
  NEW_CONTAINER="$BLUE_CONTAINER"
else
  NEXT_COLOR="blue"
  OLD_CONTAINER=""
  NEW_CONTAINER="$BLUE_CONTAINER"
fi

echo "[INFO] active color: $ACTIVE_COLOR"
echo "[INFO] next color: $NEXT_COLOR"
echo "[INFO] new container: $NEW_CONTAINER"

if docker ps -a --format '{{.Names}}' | grep -qx "$NEW_CONTAINER"; then
  docker stop -t 10 "$NEW_CONTAINER" || true
  docker rm "$NEW_CONTAINER" || true
fi

docker run -d \
  --name "$NEW_CONTAINER" \
  --network "$NETWORK_NAME" \
  --restart unless-stopped \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  "$IMAGE_NAME"

echo "[INFO] waiting for new container to become healthy..."

HEALTHCHECK="$(docker inspect --format='{{if .Config.Healthcheck}}yes{{else}}no{{end}}' "$NEW_CONTAINER")"

if [ "$HEALTHCHECK" = "yes" ]; then
  for i in $(seq 1 30); do
    STATUS="$(docker inspect --format='{{.State.Health.Status}}' "$NEW_CONTAINER")"
    if [ "$STATUS" = "healthy" ]; then
      echo "[INFO] new container is healthy"
      break
    fi

    if [ "$STATUS" = "unhealthy" ]; then
      echo "[ERROR] new container is unhealthy"
      docker logs "$NEW_CONTAINER" || true
      exit 1
    fi

    sleep 2

    if [ "$i" -eq 30 ]; then
      echo "[ERROR] health check timeout"
      docker logs "$NEW_CONTAINER" || true
      exit 1
    fi
  done
else
  echo "[WARN] no HEALTHCHECK found, waiting 10 seconds"
  sleep 10
fi

echo "[INFO] switching service alias to $NEW_CONTAINER"

docker network disconnect "$NETWORK_NAME" "$NEW_CONTAINER" >/dev/null 2>&1 || true
docker network connect --alias "$SERVICE_ALIAS" "$NETWORK_NAME" "$NEW_CONTAINER"

if [ -n "$OLD_CONTAINER" ] && docker ps --format '{{.Names}}' | grep -qx "$OLD_CONTAINER"; then
  echo "[INFO] stopping old container: $OLD_CONTAINER"
  docker stop -t 10 "$OLD_CONTAINER" || true
  docker rm "$OLD_CONTAINER" || true
fi

echo "$NEXT_COLOR" > "$ACTIVE_FILE"

docker images "farm-flow-api" --format "{{.Repository}}:{{.Tag}}" \
| grep -v ":latest$" \
| while read image; do
    if ! docker ps --format "{{.Image}}" | grep -q "$image"; then
        docker rmi "$image" >/dev/null 2>&1 || true
    fi
done

echo "[INFO] deploy completed: active=$NEXT_COLOR"