import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Search, Filter, Bookmark } from 'lucide-react';

import { Button } from '../../components/Layout';
import { HistoryItem, LANGUAGES } from '../../types';
import { StorageManager } from '../../utils/storage';
import { useLanguage } from '../../utils/LanguageContext';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [historyData, favData] = await Promise.all([
        StorageManager.getHistory(),
        StorageManager.getFavorites()
      ]);
      setHistory(historyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setFavorites(favData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.request.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.response.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = languageFilter === 'all' || item.language === languageFilter;
    
    return matchesSearch && matchesLanguage;
  });

  const handleDeleteItem = async (itemId: string) => {
    try {
      await StorageManager.removeHistoryItem(itemId);
      setHistory(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await StorageManager.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const toggleFavorite = async (item: HistoryItem) => {
    const isSaved = favorites.some(f => f.text === item.request.text);
    if (isSaved) {
       const fav = favorites.find(f => f.text === item.request.text);
       if (fav) {
         await StorageManager.removeFavorite(fav.id);
         setFavorites(prev => prev.filter(f => f.id !== fav.id));
       }
    } else {
       const newFav = {
         id: Date.now().toString(),
         text: item.request.text,
         answer: item.response.explanation,
         timestamp: new Date().toISOString()
       };
       await StorageManager.addFavorite(newFav);
       setFavorites([newFav, ...favorites]);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t('history_title')}</h2>
          <p className="text-white/70 text-sm">{t('history_desc')}</p>
        </div>
        
        {history.length > 0 && (
          <Button
            onClick={handleClearAll}
            variant="danger"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t('clear_all')}
          </Button>
        )}
      </div>

      {history.length > 0 && (
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder={t('search_history')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                <option value="all">{t('all_languages')}</option>
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Clock className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('no_history')}</h3>
          <p className="text-white/60">
            {t('no_history_desc')}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredHistory.map((item, index) => {
              const isSaved = favorites.some(f => f.text === item.request.text);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                          {item.template?.name || 'Simple'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          {LANGUAGES.find(l => l.code === item.language)?.name || item.language}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2 line-clamp-2">
                        "{item.request.text}"
                      </p>
                      <p className="text-white/70 text-sm line-clamp-3">
                        {item.response.explanation}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                      <Button
                        onClick={() => toggleFavorite(item)}
                        variant="secondary"
                        className={`!p-2 !px-2 !py-2 ${isSaved ? 'text-blue-400 bg-blue-500/20' : 'text-white/60'}`}
                        title={isSaved ? t('remove_card') : t('save_card')}
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteItem(item.id)}
                        variant="danger"
                        className="!p-2 !px-2 !py-2"
                        title={t('delete_from_history')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{item.response.charactersUsed || 0} {t('chars_used')}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};