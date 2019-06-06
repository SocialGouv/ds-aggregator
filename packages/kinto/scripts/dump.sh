#!/bin/bash
cd "$(dirname "$0")"

echo "build kinto-wizard image...."

docker build -t kinto-wizard .

CONTAINER_NAME=kinto-dump
KINTO_CONTAINER=workinfrance-bo-kinto
KINTO_URL=http://workinfrance-bo-kinto:8888/v1
KINTO_AUTH=admin:passw0rd

echo "run kinto-wizard container...."

docker run \
    --name $CONTAINER_NAME --rm -it -d \
    --link $KINTO_CONTAINER \
    -v $(pwd)/../dumps:/app \
    kinto-wizard

DATE=$(date +"%Y%m%d%H%M")

echo "dump kinto $KINTO_URL...."

docker exec \
    $CONTAINER_NAME sh -c \
    "kinto-wizard dump --server $KINTO_URL --auth $KINTO_AUTH --full > dump_$DATE.yml"

echo "Stop kinto-wizard container...."

docker stop $CONTAINER_NAME