chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_POPUP") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }

  if (message.type === "PASTE_ALLOW") {
    chrome.tabs.sendMessage(sender.tab.id, { type: "PASTE_ALLOW" });
  }

  if (message.type === "PASTE_REDACT") {
    chrome.tabs.sendMessage(sender.tab.id, { type: "PASTE_REDACT" });
  }
});
