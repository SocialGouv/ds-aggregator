global.fetch = require("node-fetch");
global.Headers = fetch.Headers;

const configs = require("./config");
const api = require("./kinto-api");

const addCollections = async () => {
  let res = await api.createBucket("ds_collector");
  console.log("[init kinto] bucket creation (ds_collector):  ", res);

  res = await api.createCollection("ds_collector", "procedures");
  console.log("[init kinto] collection creation (procedures):  ", res);

  res = await api.createCollection("ds_collector", "statistics");
  console.log("[init kinto] collection creation (statistics):  ", res);

};

const cleanIt = async () => {
  console.log("[haxxx] delete the admin account");
  await api
    .deleteAdmin(configs.adminLogin, configs.adminPassword)
    .catch(console.error);
};

const init = async () => {
  if (process.env.CLEAN_DB) {
    await cleanIt();
  }

  if (process.env.CLEAN_DB) {
    console.log("[haxxx] delete the ds_collector bucket");
    try {
      await api.deleteBucket("ds_collector");
    } catch {}
  }

  console.log("[init kinto] addCollections");
  await addCollections();
};

init().catch(console.error);
