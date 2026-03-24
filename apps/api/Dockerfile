FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN corepack enable
RUN pnpm config get registry && pnpm -v
RUN pnpm install --frozen-lockfile --ignore-scripts --reporter=ndjson
RUN pnpm run api:build
RUN pnpm prune --prod --ignore-scripts

FROM node:22-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=builder /app/apps/api/package.json /app/apps/api/package.json

HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
CMD node -e "\
  const http=require('http');\
  const req=http.get('http://127.0.0.1:4000/api/v1',res=>{process.exit(res.statusCode===200?0:1)});\
  req.on('error',()=>process.exit(1));\
  req.setTimeout(2000,()=>{req.destroy();process.exit(1)});\
"

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["pnpm", "run", "api:start"]
