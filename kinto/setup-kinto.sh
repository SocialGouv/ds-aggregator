#!/bin/bash

# create the admin account

curl -X PUT http://localhost:8888/v1/accounts/admin \
     -d '{"data": {"password": "passw0rd"}}' \
     -H 'Content-Type:application/json'


curl -u admin:passw0rd  \
    -X PUT http://localhost:8888/v1/accounts/ds-collector \
    -d '{"data": {"password": "W0rkInFranceND"}}' \
    -H 'Content-Type:application/json'

# create the bucket `ds_collector`


curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets \
     -d '{"data": {"id": "ds_collector"}}' \
     -H 'Content-Type:application/json' 


# create the collections `ds_configs, `procedure`, `dossier`, `task`, `statistic`

curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/collections \
     -d '{"data": {"id": "ds_configs"}}' \
     -H 'Content-Type:application/json' 

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

## the group `system` has READ/WRITE permission on `ds_configs`, `procedure`, `dossier`, `tasks`, `statistic`


curl -u admin:passw0rd  \
     -X POST http://localhost:8888/v1/buckets/ds_collector/groups \
     -d '{"data": {"id": "system", "members": ["account:ds-collector"]}}' \
     -H 'Content-Type:application/json' 

curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/ds_configs \
     -d '{"permissions": {"write": ["/buckets/ds_collector/groups/system"]}}' \
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

# anonymous user can READ collection `statistic`


curl -u admin:passw0rd  \
     -X PATCH http://localhost:8888/v1/buckets/ds_collector/collections/statistics \
     -d '{"permissions": {"read": ["system.Everyone"]}}' \
     -H 'Content-Type:application/json' 


