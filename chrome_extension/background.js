chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { type: "check_youtube" });
    }
  });
  