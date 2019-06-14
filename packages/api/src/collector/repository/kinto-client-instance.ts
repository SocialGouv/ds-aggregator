import { configuration } from "../../config";
import { kintoClient } from "../../lib";

const kintoAPI = configuration.kintoAPI || "";
const kintoLogin = configuration.kintoLogin || "";
const kintoPassword = configuration.kintoPassword || "";

export const kintoClientInstance = kintoClient(
  kintoAPI,
  kintoLogin,
  kintoPassword
);
