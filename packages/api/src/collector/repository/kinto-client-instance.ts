import { configuration } from "../../config";
import { kintoClient } from "../../lib";

const kintoURL = configuration.kintoURL || "";
const kintoLogin = configuration.kintoLogin || "";
const kintoPassword = configuration.kintoPassword || "";

export const kintoClientInstance = kintoClient(
  kintoURL,
  kintoLogin,
  kintoPassword
);
