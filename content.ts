chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_CONTENT') {
    const bodyText = document.body.innerText.toLowerCase();
    sendResponse({ text: bodyText });
  }
});