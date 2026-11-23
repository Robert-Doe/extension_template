const extensionApi = globalThis.browser ?? globalThis.chrome;

extensionApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GET_PAGE_INFO") {
    return false;
  }

  sendResponse({
    title: document.title,
    url: window.location.href
  });

  return false;
});
