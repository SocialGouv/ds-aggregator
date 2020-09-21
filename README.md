# ds-aggregator

[![pipeline status](https://img.shields.io/badge/pipeline-gitlab-orange?logo=gitlab)](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/-/commits/master)
[![Github Master CI Status](https://github.com/SocialGouv/ds-aggregator/workflows/ci/badge.svg?branch=master)](https://github.com/SocialGouv/ds-aggregator/actions/)
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

Releases are automaticly made through our [GitLab pipelines](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/pipelines) strictly following the [Semantic Versioning](http://semver.org/) specification thanks to [semantic-release](https://github.com/semantic-release/semantic-release).
