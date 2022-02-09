// @ts-check
const github = require("@actions/github");
/**
 * @type {(url: string, {}) => Promise<any>}
 */
// @ts-ignore
const fetch = require("node-fetch");
const { getFavroAuthHeader } = require("./getFavroAuthHeader");

const pattern = /(ITM|itm)-(\d+)/;
function getCardSequentialId() {
  if (!pattern.test(github.context.payload.pull_request?.head.ref)) return "";
  return pattern.exec(github.context.payload.pull_request?.head.ref)[2];
}

/**
 * @typedef Card
 * @type {{
    cardId: string,
    name: string,
    columnId?: string
    organizationId: "b93aa524861f22033eac48d5",
    sequentialId: number,
    customFields: {
      customFieldId: string,
      value: string[]
    }[]
  }}
 */

/**
 * Finds the Card that matches the sequential number and is enabled on the kanban board.
 *
 * @type {(cardSequentialId: string) => Promise<Card>}
 */
async function getCardIdAsync(cardSequentialId) {
  const response = await fetch(
    "https://favro.com/api/v1/cards?cardSequentialId=" + cardSequentialId,
    {
      method: "GET",
      headers: getFavroAuthHeader(),
    }
  );

  /**
   * @type {{entities: Card[]}}
   */
  // @ts-ignore this overwrites the type.
  const data = await response.json();

  console.assert(
    data.entities && data.entities.length >= 1,
    "There isn't a perfect match for this ID"
  );

  const card = data.entities?.find((x) => x.columnId);

  return card ?? null;
}

async function getFavroCardAsync() {
  const cardSequentialId = getCardSequentialId();

  if (cardSequentialId == "") return null;

  return await getCardIdAsync(cardSequentialId);
}

exports.getFavroCardAsync = getFavroCardAsync;
