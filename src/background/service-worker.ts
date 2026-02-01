// Context menu ID
const CONTEXT_MENU_ID = 'convert-timezone';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Convert to my timezone',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    const selectedText = encodeURIComponent(info.selectionText.trim());

    // Open popup with selected text as parameter
    chrome.windows.create({
      url: chrome.runtime.getURL(`popup/index.html?text=${selectedText}`),
      type: 'popup',
      width: 380,
      height: 520,
    });
  }
});

export {};
