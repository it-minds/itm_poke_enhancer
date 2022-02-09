export const IsomorphicAbortController: typeof AbortController =
  typeof window === "undefined" ? require("abort-controller") : window.AbortController;

export default IsomorphicAbortController;
