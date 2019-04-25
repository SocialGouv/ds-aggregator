# Documentation

- [Présentation du projet](https://htmlpreview.github.io/?https://github.com/SocialGouv/ds-aggregator/blob/master/project-presentation.html)
- [API démarche simplifiée](https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/api)

## Procédure de test
 
 - https://www.demarches-simplifiees.fr/procedures/9407
 - Procédure: 9407
 - Token: ********************

## données de test

- [Exemple de fichier extrait via l’API DS pour une démarche WIF](./example/example.json)
- [Example de données pour la validation d'une demande](./example/validity.json)
- [Example de données pour les statistiques](./example/stat.json)

# Kinto

[Kinto](./kinto/kinto.md)

# Synchronisation

Pour ajouter une procédure de démarche simplifiée à synchroniser:
- ajouter l'identifiant de la procédure dans la variable `DS_PROCEDURE_IDS` du fichier `.env`, puis redémarrer l'application.
- dans l'espace administrateur de la nouvelle démarche simplifiée, configurer l'URL du [web hook](https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook): `api/ds-webhook-${.env.DS_WEBHOOK_KEY}`

## Au démarrage

Au lancement de l'application, l'application synchronise l'ensemble des dossiers des procédures déclarées dans la variable `DS_PROCEDURE_IDS` du fichier `.env`.


## WebHook

A chaque changement d'état dun dossier d'une procédure, dont l'URL du [web hook](https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook) a été configuré, l'application ajoute un `record` dans la collection kinto `tasks`.

Un scheduler dont la fréquence est configurable avec la variable `TASK_SCHEDULER_PERIOD` du fichier `.env` traite synchronise les dossiers ajoutés à cette collection. Après syncrhonisation, le `record` correspondant est marqué comme `completed`.



