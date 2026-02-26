export interface Settings {
  showFloatingButton: boolean;
  historyLimit: number;
  outputLanguage: string;
  uiLanguage: string;
  aiConfig: {
    provider: 'openai' | 'anthropic' | 'google';
    model: string;
    apiKey: string;
    baseUrl?: string;
    customPrompt?: string;
  };
}

const DEFAULT_SETTINGS: Settings = {
  showFloatingButton: true,
  historyLimit: 50,
  outputLanguage: 'ru',
  uiLanguage: 'ru',
  aiConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: '',
    baseUrl: '',
    customPrompt: ''
  }
};

export class StorageManager {
  static async getSettings(): Promise<Settings> {
    const data = await chrome.storage.local.get('settings');
    return { ...DEFAULT_SETTINGS, ...data.settings };
  }

  static async saveSettings(settings: Settings): Promise<void> {
    await chrome.storage.local.set({ settings });
  }

  static async getHistory(): Promise<any[]> {
    const data = await chrome.storage.local.get('history');
    return data.history || [];
  }

  static async addToHistory(item: any): Promise<void> {
    const history = await this.getHistory();
    const settings = await this.getSettings();
    const newHistory = [item, ...history].slice(0, settings.historyLimit);
    await chrome.storage.local.set({ history: newHistory });
  }

  static async removeHistoryItem(id: string): Promise<void> {
    const history = await this.getHistory();
    const newHistory = history.filter(item => item.id !== id);
    await chrome.storage.local.set({ history: newHistory });
  }

  static async clearHistory(): Promise<void> {
    await chrome.storage.local.set({ history: [] });
  }

  // --- Favorites Management ---
  static async getFavorites(): Promise<any[]> {
    const data = await chrome.storage.local.get('favorites');
    return data.favorites || [];
  }

  static async addFavorite(item: any): Promise<void> {
    const favorites = await this.getFavorites();
    // Check if already exists by text to avoid duplicates
    if (!favorites.some(f => f.text === item.text)) {
      const newFavorites = [item, ...favorites];
      await chrome.storage.local.set({ favorites: newFavorites });
    }
  }

  static async removeFavorite(id: string): Promise<void> {
    const favorites = await this.getFavorites();
    const newFavorites = favorites.filter(item => item.id !== id);
    await chrome.storage.local.set({ favorites: newFavorites });
  }

  static async isFavorite(text: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(f => f.text === text);
  }
}