let windowObjectReference: Window = null;
let previousUrl: string = null;

export const openSignInWindow = (
  url: string,
  name: string,
  receiveMessage: (event: MessageEvent) => void
): void => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  // window features
  const strWindowFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

  if (windowObjectReference === null || windowObjectReference.closed) {
    /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
    windowObjectReference = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
    windowObjectReference = window.open(url, name, strWindowFeatures);
    windowObjectReference.focus();
  } else {
    /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
    windowObjectReference.focus();
  }

  // add the listener for receiving a message from the popup
  window.addEventListener("message", event => receiveMessage(event), false);
  // assign the previous URL
  previousUrl = url;
};

export const defaultSigninPopup = (url: string, tokenCallback: (token: string) => void) => openSignInWindow(url, "Login", e => {
  if (typeof e.data == "string" && e.data.indexOf("?token=") === 0) {
    try {
      const pairs = (e.data as string).substring(1).split("&");

      let i: string;
      for (i in pairs) {
        if (!pairs[i] || pairs[i] === "") continue;

        const pair = pairs[i].split("=");
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);

        if (key == "token") tokenCallback(value);
      }
    } catch (e) {
      console.error(e, e.data);
    }
  }
});
