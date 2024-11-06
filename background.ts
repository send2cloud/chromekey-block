chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const { keywordPairs } = await chrome.storage.sync.get('keywordPairs');
    
    if (!keywordPairs || !Array.isArray(keywordPairs)) return;

    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => document.body.innerText.toLowerCase()
      });

      for (const pair of keywordPairs) {
        if (result.includes(pair.keyword.toLowerCase())) {
          chrome.tabs.update(tabId, { url: pair.redirectUrl });
          break;
        }
      }
    } catch (error) {
      console.error('Error checking page content:', error);
    }
  }
});