timestamp=$(date +%s)

docker buildx build \
  -t farm-flow-api:latest \
  -t farm-flow-api:$timestamp \
  --load \
  .