import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MainView } from './views/MainView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { FavoritesView } from './views/FavoritesView';
import { Search, History, Settings as SettingsIcon, Bookmark } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../utils/LanguageContext';
import '../index.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'main' | 'favorites' | 'history' | 'settings'>('main');
  const { t } = useLanguage();

  const tabs = [
    { id: 'main', icon: Search, label: t('tab_main') },
    { id: 'favorites', icon: Bookmark, label: t('tab_favorites') },
    { id: 'history', icon: History, label: t('tab_history') },
    { id: 'settings', icon: SettingsIcon, label: t('tab_settings') },
  ];

  return (
    <div className="w-[400px] h-[600px] bg-slate-900 text-white flex flex-col overflow-hidden font-sans">
      {/* Header Tabs */}
      <div className="flex border-b border-white/10 bg-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50' 
                : 'text-white/50 hover:text-white/80 hover:bg-slate-800/30'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {activeTab === 'main' && <MainView />}
        {activeTab === 'favorites' && <FavoritesView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;