// @ts-check

const { favroStatus } = require("./favroStatuses");

const core = require("@actions/core");
const github = require("@actions/github");

/**
 * @typedef Review
 * @type {{userId: number, state: string}}
 */

/**
 * ! Currently Teams aren't supported.
 * @returns {Promise<Review[]>}
 */
async function getCurrentReviewRequestsAsync() {
  const token = core.getInput("token");
  const octokit = github.getOctokit(token);

  const { data: reviewRequests } =
    await octokit.rest.pulls.listRequestedReviewers({
      ...github.context.repo,
      pull_number: github.context.issue.number,
    });

  const users = reviewRequests.users.map((x) => ({
    userId: x.id,
    state: "REQUESTED",
  }));

  return users;
}

/**
 * @param {number[]} reviewRequests
 * @returns {Promise<Review[]>}
 */
async function getLatestReviewPerPersonAsync(reviewRequests) {
  const token = core.getInput("token");
  const octokit = github.getOctokit(token);

  const { data: reviews } = await octokit.rest.pulls.listReviews({
    ...github.context.repo,
    pull_number: github.context.issue.number,
  });

  const uniqueReviews = reviews
    .filter(
      // We filter out all the dismissed reviews as they no longer serve as an indicator of the latest state of the entire PR. Same goes with reviewers who have been requested a review.
      (x) => !(x.state === "DISMISSED" || reviewRequests.includes(x.user.id))
    )
    .sort(
      // Only the latest review should count towards the current PR state.
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    )
    .filter(
      (review, index, arr) =>
        arr.findIndex((x) => review.user.id === x.user.id) === index
    )
    .map((x) => ({ userId: x.user.id, state: x.state }));

  return uniqueReviews;
}

/**
 * If both the count of reviews and the review requests are 0, then the status is 'no reviewers'.
 * Loop through all reviews. If just a single review is 'changes requested' that takes precedence and is returned.
 * If there are any active review request, if so the status is 'pending'.
 * Finally, if the number of approvers is equal the number of total reviews the status is 'approved' else 'pending'
 */
async function getPRStatusAsync() {
  const reviewRequests = await getCurrentReviewRequestsAsync();
  const reviews = await getLatestReviewPerPersonAsync(
    reviewRequests.map((x) => x.userId)
  );

  if (reviews.length === 0 && reviewRequests.length === 0) {
    return favroStatus.NO_REVIEWERS;
  }

  console.log(
    "Reviews",
    JSON.stringify(reviewRequests, null, 2),
    JSON.stringify(reviews, null, 2)
  );

  let approvedCount = 0;
  for (let index = 0; index < reviews.length; index++) {
    const review = reviews[index];

    if (review.state == "CHANGES_REQUESTED") {
      return favroStatus.CHANGES_REQUESTED; // trump
    }

    if (review.state == "APPROVED") {
      approvedCount++;
    }
  }

  if (reviewRequests.length > 0) {
    return favroStatus.PENDING;
  }

  return approvedCount == reviews.length
    ? favroStatus.APPROVED
    : favroStatus.PENDING; // ! This could be misleading, as COMMENTED is a legit status that could lead the project managers to think the responsible part if the reviewer and not developer.
}

exports.getPRStatusAsync = getPRStatusAsync;
