pipeline {
  agent any

  stages {
    stage('Prepare Root Env') {
      when {
        beforeAgent true
        anyOf {
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
          changeset "apps/worker/**"
          changeset "apps/api/**"
          changeset "libs/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_CREDENTIAL_FILE'),
        ]) {
          sh '''
            ROOT_ENV_FILE=.env
            cp "$ROOT_ENV_CREDENTIAL_FILE" "$ROOT_ENV_FILE"
            chmod 600 "$ROOT_ENV_FILE"
          '''
        }
      }
    }

    stage('Migration') {
      when {
        beforeAgent true
        anyOf {
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-migration-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
        ]) {
          sh '''
            set -eu

            ROOT_DIR=$(pwd)
            APP_DIR="$ROOT_DIR/apps/migration"
            APP_ENV_FILE=apps/migration/.env
            ROOT_ENV_FILE="$ROOT_DIR/.env"
            ROOT_DOCKER_ENV_FILE=""
            APP_DOCKER_ENV_FILE=""
            IMAGE_NAME="farm-flow-migration:latest"
            CONTAINER_NAME="farm-flow-migration-run"
            NETWORK_NAME="farm-flow_farm-flow"

            cleanup() {
              rm -f "$APP_ENV_FILE"
            }

            require_env_file() {
              FILE_PATH="$1"

              if [ ! -f "$FILE_PATH" ]; then
                exit 1
              fi
            }

            prepare_docker_env_file() {
              SOURCE_FILE="$1"
              TARGET_FILE="$2"

              sed -E 's/^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$/\\1=\\2/' "$SOURCE_FILE" >"$TARGET_FILE"
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

            trap cleanup EXIT

            cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
            chmod 600 "$APP_ENV_FILE"

            timestamp=$(date +%s)

            docker buildx build \
              -f "$APP_DIR/Dockerfile" \
              -t farm-flow-migration:latest \
              -t farm-flow-migration:$timestamp \
              --load \
              "$ROOT_DIR"

            require_env_file "$ROOT_ENV_FILE"
            require_env_file "$APP_ENV_FILE"

            ROOT_DOCKER_ENV_FILE=$(mktemp)
            APP_DOCKER_ENV_FILE=$(mktemp)
            trap 'cleanup_temp_env_files; cleanup' EXIT

            prepare_docker_env_file "$ROOT_ENV_FILE" "$ROOT_DOCKER_ENV_FILE"
            prepare_docker_env_file "$APP_ENV_FILE" "$APP_DOCKER_ENV_FILE"

            ensure_network
            remove_container_if_exists "$CONTAINER_NAME"

            docker run --rm \
              --name "$CONTAINER_NAME" \
              --env-file "$ROOT_DOCKER_ENV_FILE" \
              --env-file "$APP_DOCKER_ENV_FILE" \
              --network "$NETWORK_NAME" \
              "$IMAGE_NAME"
          '''
        }
      }
    }

    stage('Services') {
      parallel {
        stage('Worker') {
          when {
            beforeAgent true
            anyOf {
              changeset "package.json"
              changeset "pnpm-lock.yaml"
              changeset "tsconfig.json"
              changeset "tsconfig.build.json"
              changeset "apps/worker/**"
              changeset "libs/**"
            }
          }
          steps {
            withCredentials([
              file(credentialsId: 'farm-flow-worker-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
            ]) {
              sh '''
                set -eu

                ROOT_DIR=$(pwd)
                APP_DIR="$ROOT_DIR/apps/worker"
                APP_ENV_FILE=apps/worker/.env
                ROOT_ENV_FILE="$ROOT_DIR/.env"
                ROOT_DOCKER_ENV_FILE=""
                APP_DOCKER_ENV_FILE=""
                IMAGE_NAME="farm-flow-worker:latest"
                NETWORK_NAME="farm-flow_farm-flow"
                SERVICE_ALIAS="farm-flow-worker"
                CONTAINER_NAME="$SERVICE_ALIAS"

                cleanup() {
                  rm -f "$APP_ENV_FILE"
                }

                require_env_file() {
                  FILE_PATH="$1"

                  if [ ! -f "$FILE_PATH" ]; then
                    exit 1
                  fi
                }

                prepare_docker_env_file() {
                  SOURCE_FILE="$1"
                  TARGET_FILE="$2"

                  sed -E 's/^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$/\\1=\\2/' "$SOURCE_FILE" >"$TARGET_FILE"
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
                  fi
                }

                container_exists() {
                  NAME="$1"
                  docker ps -a --format '{{.Names}}' | grep -qx "$NAME"
                }

                remove_container_if_exists() {
                  NAME="$1"

                  if container_exists "$NAME"; then
                    docker stop -t 10 "$NAME" >/dev/null 2>&1 || true
                    docker rm "$NAME" >/dev/null 2>&1 || true
                  fi
                }

                cleanup_unused_images() {
                  docker images "farm-flow-worker" --format "{{.Repository}}:{{.Tag}}" \
                  | grep -v ":latest$" \
                  | while read -r image; do
                      if ! docker ps --format "{{.Image}}" | grep -q "^${image}\$"; then
                        docker rmi "$image" >/dev/null 2>&1 || true
                      fi
                    done
                }

                trap cleanup EXIT

                cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
                chmod 600 "$APP_ENV_FILE"

                timestamp=$(date +%s)

                docker buildx build \
                  -f "$APP_DIR/Dockerfile" \
                  -t farm-flow-worker:latest \
                  -t farm-flow-worker:$timestamp \
                  --load \
                  "$ROOT_DIR"

                require_env_file "$ROOT_ENV_FILE"
                require_env_file "$APP_ENV_FILE"

                ROOT_DOCKER_ENV_FILE=$(mktemp)
                APP_DOCKER_ENV_FILE=$(mktemp)
                trap 'cleanup_temp_env_files; cleanup' EXIT

                prepare_docker_env_file "$ROOT_ENV_FILE" "$ROOT_DOCKER_ENV_FILE"
                prepare_docker_env_file "$APP_ENV_FILE" "$APP_DOCKER_ENV_FILE"

                ensure_network

                remove_container_if_exists "$CONTAINER_NAME"

                docker run -d \
                  --name "$CONTAINER_NAME" \
                  --env-file "$ROOT_DOCKER_ENV_FILE" \
                  --env-file "$APP_DOCKER_ENV_FILE" \
                  --network "$NETWORK_NAME" \
                  --network-alias "$SERVICE_ALIAS" \
                  --restart unless-stopped \
                  --log-opt max-size=10m \
                  --log-opt max-file=3 \
                  "$IMAGE_NAME" >/dev/null

                cleanup_unused_images
              '''
            }
          }
        }

        stage('API') {
          when {
            beforeAgent true
            anyOf {
              changeset "package.json"
              changeset "pnpm-lock.yaml"
              changeset "tsconfig.json"
              changeset "tsconfig.build.json"
              changeset "apps/api/**"
              changeset "libs/**"
            }
          }
          steps {
            withCredentials([
              file(credentialsId: 'farm-flow-api-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
            ]) {
              sh '''
                set -eu

                ROOT_DIR=$(pwd)
                APP_DIR="$ROOT_DIR/apps/api"
                APP_ENV_FILE=apps/api/.env
                ROOT_ENV_FILE="$ROOT_DIR/.env"
                ROOT_DOCKER_ENV_FILE=""
                APP_DOCKER_ENV_FILE=""
                IMAGE_NAME="farm-flow-api:latest"
                NETWORK_NAME="farm-flow_farm-flow"
                SERVICE_ALIAS="farm-flow-api"
                CONTAINER_BLUE="${SERVICE_ALIAS}-blue"
                CONTAINER_GREEN="${SERVICE_ALIAS}-green"
                STAGE_BLUE="${CONTAINER_BLUE}-stage"
                STAGE_GREEN="${CONTAINER_GREEN}-stage"

                cleanup() {
                  rm -f "$APP_ENV_FILE"
                }

                require_env_file() {
                  FILE_PATH="$1"

                  if [ ! -f "$FILE_PATH" ]; then
                    exit 1
                  fi
                }

                prepare_docker_env_file() {
                  SOURCE_FILE="$1"
                  TARGET_FILE="$2"

                  sed -E 's/^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$/\\1=\\2/' "$SOURCE_FILE" >"$TARGET_FILE"
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
                        return 0
                      fi

                      if [ "$STATUS" = "unhealthy" ]; then
                        docker logs "$NAME" || true
                        return 1
                      fi

                      sleep 2
                      i=$((i + 1))
                    done

                    docker logs "$NAME" || true
                    return 1
                  fi

                  sleep 10
                  return 0
                }

                run_stage_container() {
                  NAME="$1"

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

                  docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{printf "%s -> %v\\n" $k $v.Aliases}}{{end}}' "$NAME"

                  if ! docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if eq $k "'"$NETWORK_NAME"'"}}{{range $v.Aliases}}{{println .}}{{end}}{{end}}{{end}}' "$NAME" | grep -qx "$SERVICE_ALIAS"; then
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

                trap cleanup EXIT

                cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
                chmod 600 "$APP_ENV_FILE"

                timestamp=$(date +%s)

                docker buildx build \
                  -f "$APP_DIR/Dockerfile" \
                  -t farm-flow-api:latest \
                  -t farm-flow-api:$timestamp \
                  --load \
                  "$ROOT_DIR"

                require_env_file "$ROOT_ENV_FILE"
                require_env_file "$APP_ENV_FILE"

                ROOT_DOCKER_ENV_FILE=$(mktemp)
                APP_DOCKER_ENV_FILE=$(mktemp)
                trap 'cleanup_temp_env_files; cleanup' EXIT

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

                remove_container_if_exists "$STAGE_CONTAINER"
                remove_container_if_exists "$NEW_CONTAINER"

                run_stage_container "$STAGE_CONTAINER"

                if ! wait_for_health "$STAGE_CONTAINER"; then
                  echo "[ERROR] stage health check failed"
                  remove_container_if_exists "$STAGE_CONTAINER"
                  exit 1
                fi

                remove_container_if_exists "$STAGE_CONTAINER"
                remove_container_if_exists "$NEW_CONTAINER"

                run_live_container "$NEW_CONTAINER"

                if ! wait_for_health "$NEW_CONTAINER"; then
                  docker logs "$NEW_CONTAINER" || true
                  exit 1
                fi

                if ! verify_alias "$NEW_CONTAINER"; then
                  docker logs "$NEW_CONTAINER" || true
                  exit 1
                fi

                if [ -n "$OLD_CONTAINER" ] && container_running "$OLD_CONTAINER"; then
                  docker stop -t 10 "$OLD_CONTAINER" >/dev/null 2>&1 || true
                  docker rm "$OLD_CONTAINER" >/dev/null 2>&1 || true
                fi

                cleanup_unused_images
              '''
            }
          }
        }
      }
    }

  }

  post {
    always {
      sh '''
        ROOT_ENV_FILE=.env
        rm -f "$ROOT_ENV_FILE"
      '''
    }
  }
}
