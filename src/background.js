const extensionApi = globalThis.browser ?? globalThis.chrome;

extensionApi.runtime.onInstalled.addListener(() => {
  console.log("Extension Template installed");
});

extensionApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GET_ACTIVE_TAB") {
    return false;
  }

  extensionApi.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => sendResponse({ tab: tabs[0] ?? null }))
    .catch((error) => sendResponse({ error: error.message }));

  return true;
});
