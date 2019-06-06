#!/bin/bash
cd "$(dirname "$0")"

KINTO_CONFIG_PATH=$1

echo "dump file path: $KINTO_CONFIG_PATH"

CONTAINER_NAME=kinto-dump
KINTO_CONTAINER=ds-aggregator-kinto
KINTO_URL=http://ds-aggregator-kinto:8888/v1
KINTO_AUTH=admin:passw0rd

echo "build kinto-wizard image...."

docker build -t kinto-wizard .

echo "run kinto-wizard container...."

docker run \
    --name $CONTAINER_NAME --rm -it -d \
    --link $KINTO_CONTAINER \
    -v $(pwd)/../$KINTO_CONFIG_PATH:/app/config.yml \
    kinto-wizard


docker exec \
    $CONTAINER_NAME sh -c \
    "kinto-wizard load --server $KINTO_URL --auth $KINTO_AUTH config.yml"

echo "Stop kinto-wizard container...."

docker stop $CONTAINER_NAME