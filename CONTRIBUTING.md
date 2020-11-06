# Contributing

> Thanks for being willing to contribute !

## TL;DR

```sh
# Install
$ yarn

# Set up a local .env
cp .env.sample .env
# Ask the team @SocialGouv/workinfrance for the `DS_TOKEN` ;)

# Init the db
$ docker-compose up -d db
$ yarn api migrate

# Build the api
$ yarn build

# Start the api
$ yarn start
# http://localhost:1337/api/liveness
# Alive
```

## Recommendation

### One does not simply dev on all the procedure

To avoid the overhead of pulling **all the procedure from DS**, we recommend that you locally edit the [ds-config.ts](packages/api/src/util/ds-config.ts) so only one group remains :

```ts
export const dsConfigs = [
  {
    group: {
      id: "02",
      label: "02 - Aisne",
    },
    procedures: [19147, 19142],
  },
];
```

### Crons are slow

You can edit the cron in you local `.env` so its triggers very often

```
SCHEDULER_CRON_TASK=0 * * * * *
SCHEDULER_CRON_DS=0 * * * * *
```

Or change the [config.ts](packages/api/src/config/config.ts)

## Environnement de développement

Ajouter les `ds_configs` renseignées dans le ficher `ds-configs.ts`

```bash
curl -X POST http://localhost:4000/api/${.env.API_PREFIX}/ds_configs/init
```

Lister les démarches simplifiés pour lesquelless le nombre de dossiers importés est différent du nombre de dossiers renseigné dans la démarche simplifiée

```bash
curl -X GET http://localhost:4000/api/${.env.API_PREFIX}/procedures/check
```

récupération des statistiques pour un groupe

```bash
curl -X GET http://localhost:4000/api/statistics/13
```

Pour visualiser les statistiques dans `ds-dahsboard`, utiliser les API `/api/statitics/${groupeId}`

## Lancer en local avec docker

```bash
docker-compose up --build
```

## Fetching data from Demarche Simplifiée API

2 cron jobs are used to fetch data from the API and cache it into our database.

`dossier.scheduler` will 
- fetch the active procedures from our database
- fetch the procedures data from demarche simplifiee
- create in our database the procedures which don't exist
- update the existing procedure
- get all the "Dossier" items from the Demarche Simplifiee API
- compare the fetched dossier items update date with the one in our db
to check if we need to update it
- add tasks to our database which contain the action "add_or_update" or "delete", the last update date and items infos.
- register that we updated the items in the db at a specific time

`task.scheduler` will
- fetch the tasks from our database
- fetch each `dossier` from demarches simplifiées api and update it in our database
- delete each `dossier` marked as to delete
