# ds-aggregator

Ce dépot contient `ds-collector` qui synchronise les données de N démarches simplifiées dans une même base de données (kinto).

Les démarches simplifiées à synchroniser doivent être accessibles avec le même token API DS.

## Environnement de développement

pour lancer le projet en développement:

*démarrer et configurer `kinto`*

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

lancer une synchronisation globale:

```bash
curl -X POST http://localhost:1337/api/${.env.API_PREFIX}/sync-all
```

lancer le calcul des statistiques (il est lancé automatiquement après une synchronisation globale)

```bash
curl -X POST http://localhost:1337/api/${.env.API_PREFIX}/refresh-stats
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







