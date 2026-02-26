import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Search, Download } from 'lucide-react';
import { StorageManager } from '../../utils/storage';
import { Button } from '../../components/Layout';
import { useLanguage } from '../../utils/LanguageContext';

export const FavoritesView: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favData = await StorageManager.getFavorites();
      setFavorites(favData);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFavorites = favorites.filter(item => 
    searchQuery === '' || 
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (itemId: string) => {
    try {
      await StorageManager.removeFavorite(itemId);
      setFavorites(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  const handleExportCSV = () => {
    if (favorites.length === 0) return;

    const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;
    const csvContent = favorites.map(item => `${escapeCSV(item.text)},${escapeCSV(item.answer)}`).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `explainit-cards-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-4 text-white">{t('loading')}</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-400 fill-current" />
          {t('saved_cards')}
        </h2>
        {favorites.length > 0 && (
          <Button onClick={handleExportCSV} variant="secondary" className="!py-1.5 !px-3 text-sm flex gap-2" title={t('download_csv')}>
            <Download className="w-4 h-4" />
            CSV
          </Button>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder={t('search_cards')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Bookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/80 mb-2">{t('no_saved_cards')}</h3>
          <p className="text-white/50 text-sm px-4">
            {t('no_saved_desc')}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFavorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800 rounded-xl border border-white/10 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-blue-300 text-lg">"{item.text}"</h3>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-red-400"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-white/80 whitespace-pre-wrap mb-3">
                  {item.answer}
                </div>
                <div className="text-xs text-white/30 text-right">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};