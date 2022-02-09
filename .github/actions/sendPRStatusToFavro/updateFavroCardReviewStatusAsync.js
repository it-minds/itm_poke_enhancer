// @ts-check
/**
 * @type {(url: string, {}) => Promise<any>}
 */
// @ts-ignore
const fetch = require("node-fetch");
const { getFavroAuthHeader } = require("./getFavroAuthHeader");

const customFieldId = "zBGodRKDBNMto3AWW";

/**
 * @type {(cardId: string, statusId: string) => Promise<void>}
 */
async function updateFavroCardReviewStatusAsync(cardId, statusId) {
  const body = JSON.stringify({
    customFields: [
      {
        customFieldId,
        value: [statusId],
      },
    ],
  });

  const url = "https://favro.com/api/v1/cards/" + cardId;

  console.log(url, body);

  const response = await fetch(url, {
    method: "PUT",
    headers: getFavroAuthHeader(),
    body,
  });

  console.log(response.status, response.statusText);
}

exports.updateFavroCardReviewStatusAsync = updateFavroCardReviewStatusAsync;
