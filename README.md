# ds-aggregator

[![pipeline status](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/badges/master/pipeline.svg)](https://gitlab.factory.social.gouv.fr/SocialGouv/ds-aggregator/commits/master)
[![Build Status](https://travis-ci.com/SocialGouv/ds-aggregator.svg?branch=master)](https://travis-ci.com/SocialGouv/ds-aggregator)
[![codecov](https://codecov.io/gh/SocialGouv/ds-aggregator/branch/master/graph/badge.svg)](https://codecov.io/gh/SocialGouv/ds-aggregator)

Ce dépot contient `api` qui synchronise les données de N démarches simplifiées dans une même base de données (kinto).

Les démarches simplifiées à synchroniser doivent être accessibles avec le même token API DS.

## Environnement de développement

pour lancer le projet en développement:

*démarrer et configurer `kinto`*

```bash
cd ./packages/kinto
cp .env.sample .env
```

```bash
# run kinto in docker
yarn db:start

# configure kinto (launch only the first time)
yarn db:init
```


l'interface d'administation de kinto est accessible à l'adresse suivante `http://localhost:8888/v1/admin`:
- Compte `admin`: admin / passw0rd
- Compte `ds-collector`: ds-collector / W0rkInFranceND

ajouter un ou plusieurs `record` dans la `collection` `ds_configs`:

```json
{
    "procedures": [12858,12859],
    "group": {"id": "13","label": "13 - Bouches du Rhône"}
}
```

La liste des configurations possible est listée dans `ds-config.json`.

*démarrer et configurer `ds-collector`*

configurer `ds-collector`

```bash
cd ./packages/ds-collector
cp .env.sample .env
```

modifier les paramètres de `.env`

lancer `ds-collector`

```bash
yarn dev
```

*appeler les API de `ds-collector`*

Ajouter les `ds_configs` renseignées dans le ficher `ds-configs.ts`

```bash
curl -X POST http://localhost:1337/api/${.env.API_PREFIX}/ds_configs/init
```

Lister les démarches simplifiés pour lesquelless le nombre de dossiers importés est différent du nombre de dossiers renseigné dans la démarche simplifiée

```bash
curl -X POST http://localhost:1337/api/${.env.API_PREFIX}/dossiers/check
```

récupération des statistiques pour un groupe

 ```bash
curl -X GET http://localhost:1337/api/statistics/13
```

Pour visualiser les statistiques dans `ds-dahsboard`, utiliser les API `/api/statitics/${groupeId}`

## Description

### kinto

- deux comptes: `admin`, `ds-collector`
- un groupe `system` dont `ds-collector` est membre
- une bucket `ds_collector` avec 4 collections:

|Collection     |Description                                            | Modèle                                    |
|---------------|-------------------------------------------------------|-------------------------------------------|
|`ds_configs`   | configuration des démarches simplifiées à synchoniser | `src/collector/model/config.model.ts`     |
|`procedures`   | procédures synchronisées                              | `src/collector/model/record.model.ts`     |
|`dossiers`     | dossiers synchronisés                                 | `src/collector/model/record.model.ts`     |
|`tasks`        | liste des dossiers à synchroniser                     | `src/collector/model/task.model.ts`       |
|`statistics`   | statistique par `ds_configs`                          | `src/collector/model/statistic.model.ts`  |


pour faire un dump

```bash
yarn db:dump

# le fichier se trouve packages/kinto/scripts/dumps/dump_{TIMESTAMP}.yml
```

pour charger un dump

```bash
# DUMP_FILE_PATH: chemin relatif à partir de /packages/kinto/
yarn db:load -- -- $DUMP_FILE_PATH

```




