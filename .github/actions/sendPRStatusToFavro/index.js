// @ts-check

const core = require("@actions/core");

const { getFavroCardAsync } = require("./getFavroCardAsync");
const { getPRStatusAsync } = require("./getPRStatusAsync");
const {
  updateFavroCardReviewStatusAsync,
} = require("./updateFavroCardReviewStatusAsync");

async function run() {
  try {
    const favroCard = await getFavroCardAsync();
    if (favroCard == null) {
      core.warning("Couldn't find card id");
      return;
    }

    const status = await getPRStatusAsync();
    core.info(
      `Updating card id ITM-${favroCard.sequentialId} to status "${status.name}"`
    );

    await updateFavroCardReviewStatusAsync(
      favroCard.cardId,
      status.customFieldItemId
    );
  } catch (error) {
    core.setFailed(error);
  }
}

run();
