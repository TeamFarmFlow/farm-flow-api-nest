#!/bin/sh

APP_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

sh $APP_DIR/build.sh
sh $APP_DIR/run.sh