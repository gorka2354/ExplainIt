import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageManager } from './storage';
import { t as translate, Language } from './i18n';

interface LanguageContextType {
  uiLanguage: Language;
  setUiLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  uiLanguage: 'ru',
  setUiLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiLanguage, setUiLanguage] = useState<Language>('ru');

  useEffect(() => {
    StorageManager.getSettings().then(settings => {
      setUiLanguage((settings.uiLanguage as Language) || 'ru');
    });

    const listener = (changes: any, namespace: string) => {
      if (namespace === 'local' && changes.settings) {
        setUiLanguage(changes.settings.newValue?.uiLanguage || 'ru');
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const t = (key: string) => translate(key, uiLanguage);

  return (
    <LanguageContext.Provider value={{ uiLanguage, setUiLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
