global.fetch = require("node-fetch");
global.Headers = fetch.Headers;

const configs = require('./config');
const api = require('./kinto-api');

const init = async () => {
    await api.createAdmin(configs.adminLogin, configs.adminPassword);

    await api.createBucket('ds_collector');

    await api.createCollection('ds_collector', 'dossiers');
    await api.createCollection('ds_collector', 'ds_configs');
    await api.createCollection('ds_collector', 'procedures');
    await api.createCollection('ds_collector', 'statistics');
    await api.createCollection('ds_collector', 'synchro_histories');
    await api.createCollection('ds_collector', 'tasks');

}

init();

