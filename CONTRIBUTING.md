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
