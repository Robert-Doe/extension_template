const extensionApi = globalThis.browser ?? globalThis.chrome;
const status = document.querySelector("#status");
const result = document.querySelector("#result");

document.querySelector("#inspect-page").addEventListener("click", async () => {
  status.textContent = "Inspecting...";
  result.textContent = "";

  try {
    const [tab] = await extensionApi.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) {
      throw new Error("No active tab is available.");
    }

    const pageInfo = await extensionApi.tabs.sendMessage(tab.id, {
      type: "GET_PAGE_INFO"
    });

    result.textContent = JSON.stringify(pageInfo, null, 2);
    status.textContent = "Done";
  } catch (error) {
    status.textContent = "Unable to inspect this page";
    result.textContent = error.message;
  }
});
