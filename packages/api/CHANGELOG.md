# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

**Note:** Version bump only for package api





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
* **lint:** run tslint with auto fix ([590030e](https://github.com/SocialGouv/ds-aggregator/commit/590030e))
* **lint:** run tslint with auto fix ([9830485](https://github.com/SocialGouv/ds-aggregator/commit/9830485))


### Features

* **check:** display result in console ([95fa9bc](https://github.com/SocialGouv/ds-aggregator/commit/95fa9bc))
* **config:** add ENVIRONMENT_TYPE to define default values by enviro… ([#29](https://github.com/SocialGouv/ds-aggregator/issues/29)) ([75a1a79](https://github.com/SocialGouv/ds-aggregator/commit/75a1a79))
* **dossier-sync:** test updated date before synchronising ([3d93d08](https://github.com/SocialGouv/ds-aggregator/commit/3d93d08))





# 1.1.0 (2019-06-14)


### Bug Fixes

* **config:** keep updates from commit [#1](https://github.com/SocialGouv/ds-aggregator/issues/1)ce809 ([b56d78a](https://github.com/SocialGouv/ds-aggregator/commit/b56d78a)), closes [#1ce809](https://github.com/SocialGouv/ds-aggregator/issues/1ce809)


### Features

* add logging ([84757ac](https://github.com/SocialGouv/ds-aggregator/commit/84757ac))
* **config:** add scheduler cron ds config ([879149c](https://github.com/SocialGouv/ds-aggregator/commit/879149c))
* **config:** add scheduler cron task config ([4fbc699](https://github.com/SocialGouv/ds-aggregator/commit/4fbc699))
* **env:** clean variable ([5cb6e8e](https://github.com/SocialGouv/ds-aggregator/commit/5cb6e8e))
* **env:** merge .env files to one .env file at the root directory ([2a772e0](https://github.com/SocialGouv/ds-aggregator/commit/2a772e0))
* **lint:** use lint version 0.9.0 and fix problems ([6135031](https://github.com/SocialGouv/ds-aggregator/commit/6135031))
* **sentry:** use directy raven to capture exception ([b1e7958](https://github.com/SocialGouv/ds-aggregator/commit/b1e7958))
