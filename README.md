# ds-aggregator

[![pipeline status](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/badges/master/pipeline.svg)](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/commits/master)
[![Build Status](https://travis-ci.com/SocialGouv/ds-aggregator.svg?branch=master)](https://travis-ci.com/SocialGouv/ds-aggregator)
[![codecov](https://codecov.io/gh/SocialGouv/ds-aggregator/branch/master/graph/badge.svg)](https://codecov.io/gh/SocialGouv/ds-aggregator)

Ce dépot contient `api` qui synchronise les données de N démarches simplifiées dans une même base de données (kinto).

Les démarches simplifiées à synchroniser doivent être accessibles avec le même token API DS.

## Environnement de développement

pour lancer le projet en développement:

```bash
cp .env.sample .env
```

```bash
yarn start
```

La liste des configurations possible est listée dans `ds-config.json`.

*appeler les API de `ds-collector`*

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

## Release policy

### Auto

Trigger a custom build on [Travis](https://travis-ci.com/SocialGouv/ds-aggregator) (in the "More options" right menu) on the `master` branch with a custom config:

```yml
env:
  global:
    - RELEASE=true
```

You can change the lerna arguments though the `LERNA_ARGS` variable.

```yml
env:
  global:
    - LERNA_ARGS="major --force-publish --yes"
    - RELEASE=true
```

### Manual

You need an [Github token](https://github.com/settings/tokens/new) to release.

```sh
#
# Bump, push to git and publish to npm
$ GH_TOKEN=${GITHUB_TOKEN} yarn lerna version

#
# You might want to add a Gif to your release to make it groovy ;)
```
