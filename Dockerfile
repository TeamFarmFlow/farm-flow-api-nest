FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN corepack enable

RUN pnpm config get registry && pnpm -v
RUN pnpm install --frozen-lockfile --ignore-scripts --reporter=ndjson
RUN pnpm run build

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
CMD node -e "\
  const http=require('http');\
  const req=http.get('http://127.0.0.1:4000/api/v1',res=>{process.exit(res.statusCode===200?0:1)});\
  req.on('error',()=>process.exit(1));\
  req.setTimeout(2000,()=>{req.destroy();process.exit(1)});\
"

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]

CMD ["node"]