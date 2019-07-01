# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/SocialGouv/ds-aggregator/compare/v3.3.1...v3.4.0) (2019-07-01)


### Bug Fixes

* **api:** handle 404 if dossier not found ([601e49a](https://github.com/SocialGouv/ds-aggregator/commit/601e49a))
* **stat:** refresh stat after processing tasks ([a988ecf](https://github.com/SocialGouv/ds-aggregator/commit/a988ecf))
* **task:** sort tasks to complete by last_modified ascending ([b73d6a3](https://github.com/SocialGouv/ds-aggregator/commit/b73d6a3))


### Features

* **api:** change get('api/stat') response to be compatible with ds-dashboard' ([2df7b8b](https://github.com/SocialGouv/ds-aggregator/commit/2df7b8b))





## [3.3.1](https://github.com/SocialGouv/ds-aggregator/compare/v3.3.0...v3.3.1) (2019-06-28)

**Note:** Version bump only for package ds-aggregator





# [3.3.0](https://github.com/SocialGouv/ds-aggregator/compare/v3.2.1...v3.3.0) (2019-06-28)


### Features

* **sync:** introduce apiResult entity to improve synchronisation ([#37](https://github.com/SocialGouv/ds-aggregator/issues/37)) ([62517d3](https://github.com/SocialGouv/ds-aggregator/commit/62517d3))





## [3.2.1](https://github.com/SocialGouv/ds-aggregator/compare/v3.2.0...v3.2.1) (2019-06-27)


### Bug Fixes

* **dpt:** fix dpt name ([e2ebbe7](https://github.com/SocialGouv/ds-aggregator/commit/e2ebbe7))





# [3.2.0](https://github.com/SocialGouv/ds-aggregator/compare/v3.1.2...v3.2.0) (2019-06-27)


### Features

* add dpt: Aube / Doubs ([b3ac5ab](https://github.com/SocialGouv/ds-aggregator/commit/b3ac5ab))





## [3.1.2](https://github.com/SocialGouv/ds-aggregator/compare/v3.1.1...v3.1.2) (2019-06-27)


### Bug Fixes

* **sync:** compare update_at between dossier item and record to find dossier to update ([632c0d7](https://github.com/SocialGouv/ds-aggregator/commit/632c0d7))





## [3.1.1](https://github.com/SocialGouv/ds-aggregator/compare/v3.1.0...v3.1.1) (2019-06-25)

**Note:** Version bump only for package ds-aggregator





# [3.1.0](https://github.com/SocialGouv/ds-aggregator/compare/v3.0.0...v3.1.0) (2019-06-25)


### Features

* **procedure-sync:** delete dossiers before re-synchronising ([1c3a965](https://github.com/SocialGouv/ds-aggregator/commit/1c3a965))





# [3.0.0](https://github.com/SocialGouv/ds-aggregator/compare/v2.0.0...v3.0.0) (2019-06-24)


### Bug Fixes

* **data-type:** use number type for dossier.metadata.procedure_id ([abf36fe](https://github.com/SocialGouv/ds-aggregator/commit/abf36fe))





# [2.0.0](https://github.com/SocialGouv/ds-aggregator/compare/v1.3.0...v2.0.0) (2019-06-24)


### Bug Fixes

* **kinto:** double quote ds_key for column filtering ([273552e](https://github.com/SocialGouv/ds-aggregator/commit/273552e))


### Features

* **api:** add end point to synchronise one specific procedure ([e3e1ef3](https://github.com/SocialGouv/ds-aggregator/commit/e3e1ef3))





# [1.3.0](https://github.com/SocialGouv/ds-aggregator/compare/v1.2.1...v1.3.0) (2019-06-24)


### Features

* **timezone:** set timezone ([#34](https://github.com/SocialGouv/ds-aggregator/issues/34)) ([f041a4a](https://github.com/SocialGouv/ds-aggregator/commit/f041a4a))





## [1.2.1](https://github.com/SocialGouv/ds-aggregator/compare/v1.2.0...v1.2.1) (2019-06-21)


### Bug Fixes

* **check-procedure:** subscribe to the observable to start checking ([2785f55](https://github.com/SocialGouv/ds-aggregator/commit/2785f55))





# [1.2.0](https://github.com/SocialGouv/ds-aggregator/compare/v1.1.0...v1.2.0) (2019-06-21)


### Bug Fixes

* **deps:** update dependency dotenv to v8 ([#22](https://github.com/SocialGouv/ds-aggregator/issues/22)) ([b825a31](https://github.com/SocialGouv/ds-aggregator/commit/b825a31))
* **deps:** update dependency rxjs to ^6.5.2 ([#20](https://github.com/SocialGouv/ds-aggregator/issues/20)) ([01c7e09](https://github.com/SocialGouv/ds-aggregator/commit/01c7e09))
* **deps:** update dependency typed-rest-client to ^1.5.0 ([#21](https://github.com/SocialGouv/ds-aggregator/issues/21)) ([980c820](https://github.com/SocialGouv/ds-aggregator/commit/980c820))
* **env:** fix env variables ([#26](https://github.com/SocialGouv/ds-aggregator/issues/26)) ([5605104](https://github.com/SocialGouv/ds-aggregator/commit/5605104))
* **lint:** run tslint with auto fix ([590030e](https://github.com/SocialGouv/ds-aggregator/commit/590030e))
* **lint:** run tslint with auto fix ([9830485](https://github.com/SocialGouv/ds-aggregator/commit/9830485))


### Features

* **check:** display result in console ([95fa9bc](https://github.com/SocialGouv/ds-aggregator/commit/95fa9bc))
* **config:** add ENVIRONMENT_TYPE to define default values by enviro… ([#29](https://github.com/SocialGouv/ds-aggregator/issues/29)) ([75a1a79](https://github.com/SocialGouv/ds-aggregator/commit/75a1a79))
* **dossier-sync:** test updated date before synchronising ([3d93d08](https://github.com/SocialGouv/ds-aggregator/commit/3d93d08))
* **kinto:** init kinto with ds config in dev.* environment ([8d2e5e9](https://github.com/SocialGouv/ds-aggregator/commit/8d2e5e9))





# 1.1.0 (2019-06-14)


### Bug Fixes

* **config:** keep updates from commit [#1](https://github.com/SocialGouv/ds-aggregator/issues/1)ce809 ([b56d78a](https://github.com/SocialGouv/ds-aggregator/commit/b56d78a)), closes [#1ce809](https://github.com/SocialGouv/ds-aggregator/issues/1ce809)
* **env:** remove quote arround cron expression ([4e88bfb](https://github.com/SocialGouv/ds-aggregator/commit/4e88bfb))
* **k8s:** update env variable name ([046b066](https://github.com/SocialGouv/ds-aggregator/commit/046b066))
* **kinto:** ds-collector account creation ([ef2ff9b](https://github.com/SocialGouv/ds-aggregator/commit/ef2ff9b))
* **kinto:** fix permissions ([0efa679](https://github.com/SocialGouv/ds-aggregator/commit/0efa679))
* **kinto-client:** return data property instead of whole object ([8398d95](https://github.com/SocialGouv/ds-aggregator/commit/8398d95))
* **rest-client:** pass resource path in request ([d05f87a](https://github.com/SocialGouv/ds-aggregator/commit/d05f87a))
* **script:** use correct container name ([edc30c1](https://github.com/SocialGouv/ds-aggregator/commit/edc30c1))
* **sentry:** sentry activation ([07ab67f](https://github.com/SocialGouv/ds-aggregator/commit/07ab67f))
* **stat:** launch stat computation after global synchro ([e7873cd](https://github.com/SocialGouv/ds-aggregator/commit/e7873cd))
* **stats:** use initiated_at to compute duration ([9826fda](https://github.com/SocialGouv/ds-aggregator/commit/9826fda))


### Features

* **api:** add api to check dossier total by procedure ([ba27321](https://github.com/SocialGouv/ds-aggregator/commit/ba27321))
* **config:** add dpt 52, 63, 68 ([e57e639](https://github.com/SocialGouv/ds-aggregator/commit/e57e639))
* **config:** add scheduler cron ds config ([879149c](https://github.com/SocialGouv/ds-aggregator/commit/879149c))
* **config:** add scheduler cron task config ([4fbc699](https://github.com/SocialGouv/ds-aggregator/commit/4fbc699))
* **configuration:** configure procedure ids in .env ([aabd85b](https://github.com/SocialGouv/ds-aggregator/commit/aabd85b))
* **docke:** export postgres port ([ecab143](https://github.com/SocialGouv/ds-aggregator/commit/ecab143))
* **dossier:** add initiated_at in metadata ([67b0bb0](https://github.com/SocialGouv/ds-aggregator/commit/67b0bb0))
* **ds_configs:** add api to initialize ds_configs ([2db8f62](https://github.com/SocialGouv/ds-aggregator/commit/2db8f62))
* **ds-collector:** initial commit ([fdc51e2](https://github.com/SocialGouv/ds-aggregator/commit/fdc51e2))
* **env:** clean variable ([5cb6e8e](https://github.com/SocialGouv/ds-aggregator/commit/5cb6e8e))
* **env:** merge .env files to one .env file at the root directory ([2a772e0](https://github.com/SocialGouv/ds-aggregator/commit/2a772e0))
* **error:** handling error ([47c7c48](https://github.com/SocialGouv/ds-aggregator/commit/47c7c48))
* **instructeur:** store historic of instructors ([7bdd24a](https://github.com/SocialGouv/ds-aggregator/commit/7bdd24a))
* **kinto:** add scripts to dump, load data with kinto-wizard ([00c9c64](https://github.com/SocialGouv/ds-aggregator/commit/00c9c64))
* **kinto:** define service name ([0929609](https://github.com/SocialGouv/ds-aggregator/commit/0929609))
* **kinto api:** add delete ([c1ad2d4](https://github.com/SocialGouv/ds-aggregator/commit/c1ad2d4))
* **lint:** use lint version 0.9.0 and fix problems ([6135031](https://github.com/SocialGouv/ds-aggregator/commit/6135031))
* **logger:** format json in console log ([34a302b](https://github.com/SocialGouv/ds-aggregator/commit/34a302b))
* **private-db:** add lerna package ([49fe842](https://github.com/SocialGouv/ds-aggregator/commit/49fe842))
* **sentry:** add sentry support ([c0d7e4f](https://github.com/SocialGouv/ds-aggregator/commit/c0d7e4f))
* **sentry:** use directy raven to capture exception ([b1e7958](https://github.com/SocialGouv/ds-aggregator/commit/b1e7958))
* **stat:** add ds statistic ([9ebd965](https://github.com/SocialGouv/ds-aggregator/commit/9ebd965))
* handle ds-procedure-config in DB ([ba2a26d](https://github.com/SocialGouv/ds-aggregator/commit/ba2a26d))
* **stat:** test and fix ([80c4b99](https://github.com/SocialGouv/ds-aggregator/commit/80c4b99))
* add logging ([84757ac](https://github.com/SocialGouv/ds-aggregator/commit/84757ac))
* add metadata timestamps and updated dossier ([db72268](https://github.com/SocialGouv/ds-aggregator/commit/db72268))
* **sync:** add API to launch global synchro and statistics computation ([81fd343](https://github.com/SocialGouv/ds-aggregator/commit/81fd343))
* **sync:** launch statistic computation one time after synch ([45d448e](https://github.com/SocialGouv/ds-aggregator/commit/45d448e))
* **synchro-history:** add synchro history support ([b5ebcaf](https://github.com/SocialGouv/ds-aggregator/commit/b5ebcaf))
* **task:** add scheduler to handle task to complete ([0c3d9f0](https://github.com/SocialGouv/ds-aggregator/commit/0c3d9f0))
* **webhook:** add webhook and tasks collection ([261e6cd](https://github.com/SocialGouv/ds-aggregator/commit/261e6cd))
* add rest-client + clean sync service ([42bb640](https://github.com/SocialGouv/ds-aggregator/commit/42bb640))
* handle pagination ([e7fdf5c](https://github.com/SocialGouv/ds-aggregator/commit/e7fdf5c))
* store group in dossier ([e776376](https://github.com/SocialGouv/ds-aggregator/commit/e776376))
