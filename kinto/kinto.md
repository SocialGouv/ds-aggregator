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

create the admin account

```bash
curl -X PUT http://localhost:8888/v1/accounts/admin \
     -d '{"data": {"password": "passw0rd"}}' \
     -H 'Content-Type:application/json'
```

```bash
curl -X PUT http://localhost:8888/v1/accounts/ds-collector \
     -d '{"data": {"password": "W0rkInFranceND"}}' \
     -H 'Content-Type:application/json'
```

create the bucket `ds_collector`

```bash
curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets \
     -d '{"data": {"id": "ds_collector"}}' \
     -H 'Content-Type:application/json' 
```


create the collections `procedure`, `dossier`, `task`, `statistic`

```bash
curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/collections \
     -d '{"data": {"id": "procedures"}}' \
     -H 'Content-Type:application/json' 

curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/collections \
     -d '{"data": {"id": "dossiers"}}' \
     -H 'Content-Type:application/json'

curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/collections \
     -d '{"data": {"id": "tasks"}}' \
     -H 'Content-Type:application/json'

curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/collections \
     -d '{"data": {"id": "statistics"}}' \
     -H 'Content-Type:application/json' 
```

the group `system` has READ/WRITE permission on `procedure`, `dossier`, `tasks`, `statistic`

```bash
curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/groups \
     -d '{"data": {"id": "system", "members": ["account:ds-collector"]}}' \
     -H 'Content-Type:application/json' 


curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/procedures \
     -d '{"permissions": {"write": ["/buckets/ds_collector/groups/system"]}}' \
     -H 'Content-Type:application/json' 

curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/dossiers \
     -d '{"permissions": {"write": ["/buckets/ds_collector/groups/system"]}}' \
     -H 'Content-Type:application/json'

curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/tasks \
     -d '{"permissions": {"write": ["/buckets/ds_collector/groups/system"]}}' \
     -H 'Content-Type:application/json'

curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/statistics \
     -d '{"permissions": {"write": ["/buckets/ds_collector/groups/system"]}}' \
     -H 'Content-Type:application/json'
```

anonymous user can READ collection `statistic`

```bash
curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/statistics \
     -d '{"permissions": {"read": ["system.Everyone"]}}' \
     -H 'Content-Type:application/json' 
```


