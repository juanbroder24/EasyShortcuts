chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-menu") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab.url.startsWith('chrome://') && !activeTab.url.startsWith('file://')) {
        chrome.tabs.sendMessage(activeTab.id, { action: "getMousePosition" }, (response) => {
          if (response && response.x && response.y) {
            chrome.tabs.sendMessage(activeTab.id, { 
              action: "toggleRadialMenu",
              position: { x: response.x, y: response.y }
            });
          }
        });
      } else {
        console.warn('Cannot execute scripts on chrome:// or file:// URLs');
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateCustomLinks") {
    chrome.storage.sync.set(message.customLinks, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { 
          action: "updateCustomLinks",
          customLinks: message.customLinks
        });
      });
    });
  } else if (message.action === "getCustomLinks") {
    chrome.storage.sync.get(['customLink1', 'customLink2'], (result) => {
      const customLinks = {
        customLink1: result.customLink1 || { url: 'https://www.example1.com', text: 'Custom 1' },
        customLink2: result.customLink2 || { url: 'https://www.example2.com', text: 'Custom 2' }
      };
      chrome.tabs.sendMessage(sender.tab.id, { 
        action: "updateCustomLinks",
        customLinks: customLinks
      });
    });
  }
});