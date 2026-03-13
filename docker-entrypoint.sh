#!/usr/bin/env sh

set -eu

pnpm run migration:run

exec pnpm run prod