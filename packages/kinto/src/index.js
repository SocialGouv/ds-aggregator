global.fetch = require("node-fetch");
global.Headers = fetch.Headers;

const configs = require('./config');
const api = require('./kinto-api');

const init = async () => {
    await api.createAdmin(configs.adminLogin, configs.adminPassword);
    await api.createUser(configs.userLogin, configs.userPassword);
}

init();

