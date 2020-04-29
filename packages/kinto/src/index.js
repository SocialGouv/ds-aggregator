global.fetch = require("node-fetch");
global.Headers = fetch.Headers;

const configs = require("./config");
const api = require("./kinto-api");

const addCollections = async () => {
  let res = await api.createBucket("ds_collector");
  console.log("[init kinto] bucket creation (ds_collector):  ", res);

  res = await api.createCollection("ds_collector", "dossiers");
  console.log("[init kinto] collection creation (dossiers):  ", res);

  res = await api.createCollection("ds_collector", "ds_configs");
  console.log("[init kinto] collection creation (ds_configs):  ", res);

  res = await api.createCollection("ds_collector", "procedures");
  console.log("[init kinto] collection creation (procedures):  ", res);

  res = await api.createCollection("ds_collector", "statistics");
  console.log("[init kinto] collection creation (statistics):  ", res);

  res = await api.createCollection("ds_collector", "synchro_histories");
  console.log("[init kinto] collection creation (synchro_histories):  ", res);

  res = await api.createCollection("ds_collector", "tasks");
  console.log("[init kinto] collection creation (task):  ", res);

  res = await api.createCollection("ds_collector", "api_results");
  console.log("[init kinto] collection creation (api_results):  ", res);
};

const addDSConfig = async () => {
  if (
    configs.environmentType === "dev.factory" ||
    configs.environmentType === "dev.local"
  ) {
    const dsConfig = {
      group: {
        id: "69",
        label: "69 - Rhône"
      },
      procedures: [6274, 6286]
    };
    {
      const res = await api.createRecord(
        "ds_collector",
        "ds_configs",
        dsConfig
      );
      console.log("[init kinto] add ds_configs record:  ", res);
    }
    {
      const res = await api.createRecord("ds_collector", "synchro_histories", {
        scheduler: "task",
        last_synchro: 0
      });
      console.log("[init kinto] add synchro_histories record:  ", res);
    }
  } else {
    console.log(
      `[init kinto] ENVIRONMENT_TYPE=  "${configs.environmentType}, no 'ds_configs' record has been created.`
    );
  }
};
const init = async () => {
  const isNewUser = await api
    .createAdmin(configs.adminLogin, configs.adminPassword)
    .then(
      () => false,
      res => Boolean(res.data)
    );

  console.log("[haxxx] delete the ds_collector bucket");
  await api.deleteBucket("ds_collector");

  console.log("[init kinto] addCollections");
  await addCollections();

  if (isNewUser) {
    console.log("[init kinto] admin created");
    await addDSConfig();
  } else {
    console.log("[init kinto] kinto already initialised... ");
  }
};

init().catch(console.error);
