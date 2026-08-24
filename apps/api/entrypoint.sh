#!/bin/sh

case "$1" in
  api)
    exec /var/task/api
    ;;
  batch)
    exec /var/task/batch
    ;;
  *)
    echo "unknown Lambda command: $1" >&2
    exit 1
    ;;
esac
