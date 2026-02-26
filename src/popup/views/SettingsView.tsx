import React, { useState, useEffect } from 'react';
import { StorageManager, Settings } from '../../utils/storage';
import { Settings as SettingsIcon, Key, Info, Languages, Bot, Globe } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const MODELS = {
  openai: [
    { id: 'o1', name: 'o1 (Top Reasoning)' },
    { id: 'o3-mini', name: 'o3-mini (Fast Reasoning)' },
    { id: 'gpt-4o', name: 'GPT-4o (Standard Flagship)' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Cheap)' }
  ],
  anthropic: [
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet (Newest)' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Legacy Heavy)' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' }
  ],
  google: [
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro (Future/Experimental)' },
    { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Newest Flagship)' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro Experimental' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
  ]
};

const LANGUAGES_LIST = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ja', name: '日本語 (Japanese)' }
];

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    StorageManager.getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    await StorageManager.saveSettings(newSettings);
  };

  if (loading || !settings) return <div className="p-4 text-white">{t('loading')}</div>;

  const currentProvider = settings.aiConfig.provider;
  const availableModels = MODELS[currentProvider] || [];

  return (
    <div className="flex flex-col gap-6 p-5 pb-10">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <SettingsIcon className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">{t('ai_settings')}</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* UI LANGUAGE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Globe className="w-4 h-4" /> {t('ui_lang')}
          </label>
          <select 
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.uiLanguage || 'ru'}
            onChange={(e) => saveSettings({
              ...settings,
              uiLanguage: e.target.value
            })}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* API PROVIDER */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-sm font-medium text-white/80">{t('ai_provider')}</label>
          <select 
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.aiConfig.provider}
            onChange={(e) => {
              const newProvider = e.target.value as keyof typeof MODELS;
              const defaultModel = MODELS[newProvider][0].id;
              saveSettings({
                ...settings,
                aiConfig: { 
                  ...settings.aiConfig, 
                  provider: newProvider,
                  model: defaultModel
                }
              });
            }}
          >
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="google">Google (Gemini)</option>
          </select>
        </div>

        {/* API KEY */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Key className="w-4 h-4" /> {t('api_key')}
          </label>
          <input 
            type="password"
            placeholder="sk-..."
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white placeholder-white/30 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.aiConfig.apiKey}
            onChange={(e) => saveSettings({
              ...settings,
              aiConfig: { ...settings.aiConfig, apiKey: e.target.value }
            })}
          />
          <p className="text-[11px] text-white/50 mt-1">{t('api_key_desc')}</p>
        </div>

        {/* CUSTOM BASE URL (Optional) */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            {t('base_url')}
          </label>
          <input 
            type="text"
            placeholder="http://localhost:8045/v1"
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white placeholder-white/30 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.aiConfig.baseUrl || ''}
            onChange={(e) => saveSettings({
              ...settings,
              aiConfig: { ...settings.aiConfig, baseUrl: e.target.value }
            })}
          />
          <p className="text-[11px] text-white/50 mt-1">{t('base_url_desc')}</p>
        </div>

        {/* MODEL SELECT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/80">{t('model')}</label>
          <select 
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.aiConfig.model}
            onChange={(e) => saveSettings({
              ...settings,
              aiConfig: { ...settings.aiConfig, model: e.target.value }
            })}
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        
        {/* OUTPUT LANGUAGE */}
        <div className="flex flex-col gap-1.5 mt-2 border-t border-white/10 pt-4">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Languages className="w-4 h-4" /> {t('output_lang')}
          </label>
          <select 
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={settings.outputLanguage || 'ru'}
            onChange={(e) => saveSettings({
              ...settings,
              outputLanguage: e.target.value
            })}
          >
            {LANGUAGES_LIST.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        {/* CUSTOM PROMPT */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Bot className="w-4 h-4" /> {t('custom_prompt')}
          </label>
          <textarea 
            placeholder={t('custom_prompt_placeholder')}
            className="p-2.5 border border-white/20 rounded-lg bg-slate-800 text-white placeholder-white/30 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px] resize-y text-sm"
            value={settings.aiConfig.customPrompt || ''}
            onChange={(e) => saveSettings({
              ...settings,
              aiConfig: { ...settings.aiConfig, customPrompt: e.target.value }
            })}
          />
          <p className="text-[11px] text-white/50 mt-1">{t('custom_prompt_desc')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-4 mt-2">
        <h3 className="text-sm font-bold text-white/80">{t('interface_settings')}</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="checkbox"
              className="peer sr-only"
              checked={settings.showFloatingButton}
              onChange={(e) => saveSettings({ ...settings, showFloatingButton: e.target.checked })}
            />
            <div className="w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
          <span className="text-sm text-white/80 group-hover:text-white transition-colors">{t('show_magnifier')}</span>
        </label>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl flex gap-3 mt-2 mb-4">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-200 leading-relaxed">
          {t('direct_requests_desc')}
        </p>
      </div>
    </div>
  );
};