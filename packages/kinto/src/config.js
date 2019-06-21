const dotenv = require("dotenv");

dotenv.config({ path: "./../../.env" });

module.exports.environmentType = process.env.ENVIRONMENT_TYPE;
module.exports.kintoURL = process.env.KINTO_URL;
module.exports.adminLogin = process.env.KINTO_LOGIN;
module.exports.adminPassword = process.env.KINTO_PASSWORD;
