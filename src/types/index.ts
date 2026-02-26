export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  charactersUsed: number;
  charactersLimit: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  isBuiltIn: boolean;
  createdAt: Date;
}

export interface ExplanationRequest {
  text: string;
  lang: string;
  templateId?: string;
  templateText?: string;
  plan: 'free' | 'pro';
  proFeatures: {
    showExamples: boolean;
    includeUrl: boolean;
    chatMode: boolean;
  };
  url?: string;
}

export interface ExplanationResponse {
  id: string;
  explanation: string;
  examples?: string[];
  chatContext?: string;
  charactersUsed: number;
}

export interface HistoryItem {
  id: string;
  request: ExplanationRequest;
  response: ExplanationResponse;
  timestamp: Date;
  template: Template;
  language: string;
}

export interface Settings {
  language: string;
  autoDetectLanguage: boolean;
  showFloatingButton: boolean;
  darkTheme: boolean;
  hotkey: string;
  defaultTemplate: string;
  domainBlacklist: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pl', name: 'Polski' },
  { code: 'nl', name: 'Nederlands' }
];

export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'school',
    name: 'School Level',
    description: 'Simple explanation for students',
    prompt: 'Explain this term in simple, clear language suitable for high school students',
    isBuiltIn: true,
    createdAt: new Date()
  },
  {
    id: 'science',
    name: 'Scientific',
    description: 'Technical and precise explanation',
    prompt: 'Provide a detailed scientific explanation with technical terminology',
    isBuiltIn: true,
    createdAt: new Date()
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Easy to understand explanation',
    prompt: 'Explain this in the simplest way possible, avoiding complex terms',
    isBuiltIn: true,
    createdAt: new Date()
  },
  {
    id: 'kid5',
    name: 'For 5-year-old',
    description: 'Explanation for very young children',
    prompt: 'Explain this as if you are talking to a 5-year-old child, using simple words and examples they can understand',
    isBuiltIn: true,
    createdAt: new Date()
  }
];

export const DEFAULT_BLACKLISTED_DOMAINS = [
  'accounts.google.com',
  'mail.google.com',
  'passport.yandex.com',
  'mail.yandex.com',
  'web.whatsapp.com',
  'web.telegram.org',
  'online.sberbank.ru',
  'gosuslugi.ru',
  'bank.ru',
  'alfabank.ru'
];