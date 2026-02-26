import { StorageManager } from '../utils/storage';
import { t } from '../utils/i18n';

let shadowRoot: ShadowRoot | null = null;
let container: HTMLElement | null = null;
let currentUiLang = 'ru';

async function init() {
  const settings = await StorageManager.getSettings();
  currentUiLang = settings.uiLanguage || 'ru';
  if (!settings.showFloatingButton) return;

  setupTextSelectionHandler();
  setupMessageListener();
}

function createContainer() {
  if (container) return;
  container = document.createElement('div');
  container.id = 'explainit-root';
  container.style.position = 'absolute';
  container.style.zIndex = '2147483647'; // Max z-index
  container.style.top = '0';
  container.style.left = '0';
  document.body.appendChild(container);
  
  shadowRoot = container.attachShadow({ mode: 'open' });
}

function setupTextSelectionHandler() {
  document.addEventListener('mouseup', (e) => {
    if (e.composedPath().includes(container as any)) return;
    setTimeout(() => handleTextSelection(e), 50);
  });
  
  document.addEventListener('mousedown', (e) => {
    if (container && !e.composedPath().includes(container as any)) {
      hideUI();
    }
  });
}

function handleTextSelection(e: MouseEvent) {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selectedText && selectedText.length > 0) {
    showButton(selection, e);
  } else {
    hideUI();
  }
}

function showButton(selection: Selection, e: MouseEvent) {
  createContainer();
  if (!shadowRoot || !container) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const top = rect.bottom + window.scrollY + 10;
  let left = e.pageX + 10;

  if (left + 40 > window.innerWidth) left = window.innerWidth - 40;

  shadowRoot.innerHTML = `
    <style>
      .btn {
        width: 32px;
        height: 32px;
        background: #3B82F6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.2s ease, background 0.2s ease;
        border: 2px solid white;
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        z-index: 9999;
      }
      .btn:hover {
        transform: scale(1.1);
        background: #2563EB;
      }
      .btn svg {
        color: white;
        width: 16px;
        height: 16px;
      }
    </style>
    <div class="btn" id="explainit-trigger" title="${t('explain_btn', currentUiLang)}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    </div>
  `;

  container.style.display = 'block';

  const btn = shadowRoot.getElementById('explainit-trigger');
  if (btn) {
    btn.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    btn.onclick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      const text = window.getSelection()?.toString().trim();
      if (text) {
        showTooltip(top, left, t('analyzing', currentUiLang), true);
        chrome.runtime.sendMessage({
          type: "EXPLAIN",
          payload: { text, lang: 'ru' }
        }, (response) => {
          if (chrome.runtime.lastError) {
             showTooltip(top, left, t('system_error', currentUiLang) + chrome.runtime.lastError.message, false, true);
             return;
          }
          if (response?.ok) {
             showTooltip(top, left, response.answer, false, false, text);
          } else {
             showTooltip(top, left, t('error', currentUiLang) + ": " + (response?.error || t('unknown_error', currentUiLang)), false, true);
          }
        });
      }
    };
  }
}

function showTooltip(top: number, left: number, text: string, isLoading: boolean, isError: boolean = false, originalRequest?: string) {
  if (!shadowRoot) return;

  let adjustedLeft = left;
  if (adjustedLeft + 300 > window.innerWidth) adjustedLeft = window.innerWidth - 320;

  const bgClass = isError ? '#fee2e2' : '#1e293b';
  const textClass = isError ? '#991b1b' : '#f8fafc';

  shadowRoot.innerHTML = `
    <style>
      .tooltip {
        position: absolute;
        top: ${top}px;
        left: ${adjustedLeft}px;
        width: 320px;
        background: ${bgClass};
        color: ${textClass};
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        z-index: 10000;
        border: 1px solid rgba(255,255,255,0.1);
        animation: fadeIn 0.2s ease-out;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 8px;
      }
      .title {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        color: ${isError ? '#991b1b' : '#93c5fd'};
      }
      .actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .icon-btn {
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
        background: none;
        border: none;
        color: inherit;
        padding: 4px;
        display: flex;
      }
      .icon-btn:hover {
        opacity: 1;
      }
      .icon-btn.saved {
        opacity: 1;
        color: #60a5fa;
      }
      .content {
        max-height: 300px;
        overflow-y: auto;
        white-space: pre-wrap;
      }
      .content::-webkit-scrollbar {
        width: 6px;
      }
      .content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 3px;
      }
      .quick-actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }
      .qa-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: #e2e8f0;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .qa-btn:hover:not(:disabled) {
        background: rgba(255,255,255,0.2);
      }
      .qa-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .qa-section {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed rgba(255,255,255,0.1);
        font-size: 13px;
      }
      .qa-title {
        font-weight: bold;
        color: #93c5fd;
        margin-bottom: 6px;
      }
    </style>
    <div class="tooltip">
      <div class="header">
        <div class="title">
          ${isLoading ? '<div class="spinner"></div>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'}
          ${isLoading ? t('explaining', currentUiLang) : 'ExplainIt'}
        </div>
        <div class="actions">
          ${(!isLoading && !isError && originalRequest) ? `
            <button class="icon-btn" id="explainit-speak" title="${t('listen', currentUiLang)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </button>
            <button class="icon-btn" id="explainit-save" title="${t('save_card', currentUiLang)}">
              <svg id="save-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
          ` : ''}
          <button class="icon-btn" id="explainit-close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div class="content" id="explainit-content">${text}</div>
      ${(!isLoading && !isError && originalRequest) ? `
        <div class="quick-actions">
          <button class="qa-btn" id="qa-synonyms">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
            ${t('synonyms', currentUiLang)}
          </button>
          <button class="qa-btn" id="qa-examples">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            ${t('examples', currentUiLang)}
          </button>
        </div>
      ` : ''}
    </div>
  `;

  const closeBtn = shadowRoot.getElementById('explainit-close');
  if (closeBtn) {
    closeBtn.onclick = hideUI;
  }

  const speakBtn = shadowRoot.getElementById('explainit-speak');
  if (speakBtn && originalRequest) {
    speakBtn.onclick = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(originalRequest);
        window.speechSynthesis.speak(utterance);
      }
    };
  }

  const saveBtn = shadowRoot.getElementById('explainit-save');
  const saveIcon = shadowRoot.getElementById('save-icon');
  if (saveBtn && originalRequest && !isLoading && !isError) {
    StorageManager.isFavorite(originalRequest).then(isSaved => {
      if (isSaved) {
        saveBtn.classList.add('saved');
        if(saveIcon) saveIcon.setAttribute('fill', 'currentColor');
      }
    });

    saveBtn.onclick = async () => {
      const isSaved = saveBtn.classList.contains('saved');
      if (isSaved) {
        const favorites = await StorageManager.getFavorites();
        const fav = favorites.find(f => f.text === originalRequest);
        if (fav) await StorageManager.removeFavorite(fav.id);
        saveBtn.classList.remove('saved');
        if(saveIcon) saveIcon.setAttribute('fill', 'none');
      } else {
        await StorageManager.addFavorite({
          id: Date.now().toString(),
          text: originalRequest,
          answer: text,
          timestamp: new Date().toISOString()
        });
        saveBtn.classList.add('saved');
        if(saveIcon) saveIcon.setAttribute('fill', 'currentColor');
      }
    };
  }

  const handleQuickAction = (action: 'synonyms' | 'examples', btnId: string, title: string) => {
    const btn = shadowRoot?.getElementById(btnId) as HTMLButtonElement;
    const content = shadowRoot?.getElementById('explainit-content');
    if (!btn || !content || !originalRequest) return;

    btn.disabled = true;
    btn.innerHTML = `<div class="spinner" style="width:12px;height:12px;border-width:2px;"></div> ${t('loading', currentUiLang)}`;

    chrome.runtime.sendMessage({
      type: "QUICK_ACTION",
      payload: { text: originalRequest, action, lang: 'ru' }
    }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        btn.innerHTML = t('error', currentUiLang);
        return;
      }
      
      btn.style.display = 'none';
      
      const qaSection = document.createElement('div');
      qaSection.className = 'qa-section';
      qaSection.innerHTML = `<div class="qa-title">${title}</div><div>${response.answer}</div>`;
      content.appendChild(qaSection);
      content.scrollTop = content.scrollHeight;
    });
  };

  const synBtn = shadowRoot.getElementById('qa-synonyms');
  if (synBtn) {
    synBtn.onclick = () => handleQuickAction('synonyms', 'qa-synonyms', t('synonyms', currentUiLang) + ':');
  }

  const exBtn = shadowRoot.getElementById('qa-examples');
  if (exBtn) {
    exBtn.onclick = () => handleQuickAction('examples', 'qa-examples', t('examples', currentUiLang) + ':');
  }
}

function hideUI() {
  if (container) {
    container.style.display = 'none';
    if (shadowRoot) shadowRoot.innerHTML = '';
  }
}

function setupMessageListener() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SHOW_TOOLTIP_FROM_CONTEXT_MENU") {
      const text = msg.text;
      let top = window.scrollY + window.innerHeight / 2;
      let left = window.scrollX + window.innerWidth / 2 - 150;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.toString().trim() === text) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        top = rect.bottom + window.scrollY + 10;
        left = rect.left + window.scrollX;
      }

      createContainer();
      if (container) container.style.display = 'block';
      showTooltip(top, left, t('analyzing', currentUiLang), true);
      
      chrome.runtime.sendMessage({
        type: "EXPLAIN",
        payload: { text, lang: 'ru' }
      }, (response) => {
        if (chrome.runtime.lastError) {
           showTooltip(top, left, t('system_error', currentUiLang) + chrome.runtime.lastError.message, false, true);
           return;
        }
        if (response?.ok) {
           showTooltip(top, left, response.answer, false, false, text);
        } else {
           showTooltip(top, left, t('error', currentUiLang) + ": " + (response?.error || t('unknown_error', currentUiLang)), false, true);
        }
      });
      sendResponse({ok: true});
    }
  });
}

init();