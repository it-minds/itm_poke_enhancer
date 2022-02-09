// @ts-check
const core = require("@actions/core");

function getFavroAuthHeader() {
  const username = core.getInput("favroUserName");
  const password = core.getInput("favroToken");

  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  return {
    "Content-Type": "application/json",
    organizationId: "b93aa524861f22033eac48d5",
    Authorization: basicAuth,
  };
}

exports.getFavroAuthHeader = getFavroAuthHeader;
