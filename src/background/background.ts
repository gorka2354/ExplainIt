import { ApiClient } from '../utils/api';
import { StorageManager } from '../utils/storage';

console.log("[ExplainIt] Background script started");

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "EXPLAIN") {
    const { text, lang = "ru" } = msg.payload || {};
    
    (async () => {
      try {
        const answer = await ApiClient.explain(text, lang);
        const historyItem = {
          id: Date.now().toString(),
          request: { text },
          response: { explanation: answer },
          timestamp: new Date().toISOString(),
          template: { name: 'BYOK Default' },
          language: lang
        };
        await StorageManager.addToHistory(historyItem);
        sendResponse({ ok: true, answer });
      } catch (err: any) {
        console.error("[BG] Explain error:", err);
        sendResponse({ ok: false, error: String(err.message || err) });
      }
    })();
    
    return true; // Keep channel open for async
  }

  if (msg?.type === "QUICK_ACTION") {
    const { text, action, lang = "ru" } = msg.payload || {};
    
    (async () => {
      try {
        const answer = await ApiClient.quickAction(text, action, lang);
        sendResponse({ ok: true, answer });
      } catch (err: any) {
        console.error("[BG] Quick Action error:", err);
        sendResponse({ ok: false, error: String(err.message || err) });
      }
    })();
    
    return true;
  }
  
  return false;
});

// Context Menu Setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-selection",
    title: "Explain It",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-selection" && info.selectionText && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_TOOLTIP_FROM_CONTEXT_MENU",
      text: info.selectionText
    });
  }
});