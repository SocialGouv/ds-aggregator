# Kinto

## basic commands

```bash
# Stop the containers with
$ docker-compose stop

# Start the containers with (-d is for background/daemon).
$ docker-compose up -d

# Connect to PostgreSQL service with
$ docker-compose exec --user postgres db psql

# Install a plugin into kinto with
$ docker-compose exec web pip3 install kinto-pusher

# Inspect the kinto config file with
$ docker-compose exec web cat /etc/kinto/kinto.ini
```

## Kinto admin

A web UI is accessible: `http://localhost:8888/v1/admin/#/`

## configuration

[script d'initialisation](./setup-kinto.sh)


