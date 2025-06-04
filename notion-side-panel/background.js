const defaultUrl =
  'https://www.notion.so/kmle/note-208b35c8bd6580b9a097c311507b129e';
let panelWindowId = null;

async function createPanel(url) {
  const [display] = await chrome.system.display.getInfo();
  const { width, height } = display.workArea;
  const panelWidth = 800;
  return new Promise((resolve) => {
    chrome.windows.create(
      {
        url,
        type: 'popup',
        width: panelWidth,
        height,
        left: width - panelWidth,
        top: 0,
      },
      (win) => {
        panelWindowId = win.id;
        resolve(win);
      },
    );
  });
}

// Restore panel on extension startup
chrome.runtime.onStartup.addListener(async () => {
  const { lastUrl = defaultUrl } = await chrome.storage.local.get('lastUrl');
  await createPanel(lastUrl);
});

// Also restore on extension install/enable
chrome.runtime.onInstalled.addListener(async () => {
  const { lastUrl = defaultUrl } = await chrome.storage.local.get('lastUrl');
  await createPanel(lastUrl);
});

chrome.action.onClicked.addListener(async () => {
  if (panelWindowId) {
    try {
      await chrome.windows.update(panelWindowId, { focused: true });
      return;
    } catch (e) {
      panelWindowId = null;
    }
  }

  const { lastUrl = defaultUrl } = await chrome.storage.local.get('lastUrl');
  await createPanel(lastUrl);

  chrome.windows.onRemoved.addListener(function listener(id) {
    if (id === panelWindowId) {
      panelWindowId = null;
      chrome.windows.onRemoved.removeListener(listener);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.windowId === panelWindowId && changeInfo.url) {
    chrome.storage.local.set({ lastUrl: changeInfo.url });
  }
});