import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Zap, RefreshCw, Bookmark, List, BookOpen, Volume2 } from 'lucide-react';
import { Button } from '../../components/Layout';
import { ApiClient } from '../../utils/api';
import { StorageManager } from '../../utils/storage';
import { useLanguage } from '../../utils/LanguageContext';

export const MainView: React.FC = () => {
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const [qaLoading, setQaLoading] = useState<'synonyms' | 'examples' | null>(null);
  const [qaResults, setQaResults] = useState<{synonyms?: string, examples?: string}>({});

  const { t } = useLanguage();

  // Check if we selected text before opening
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => window.getSelection()?.toString() || ''
        }, (results) => {
          if (results && results[0]?.result) {
            setText(results[0].result);
          }
        });
      }
    });
  }, []);

  const checkIsSaved = async (term: string) => {
    const saved = await StorageManager.isFavorite(term);
    setIsSaved(saved);
  };

  const handleExplain = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    setIsSaved(false);
    setQaResults({});

    try {
      const result = await ApiClient.explain(text);
      setAnswer(result);
      
      // Save to history
      await StorageManager.addToHistory({
        id: Date.now().toString(),
        request: { text },
        response: { explanation: result },
        timestamp: new Date().toISOString(),
        template: { name: 'BYOK Default' },
        language: 'ru' // This remains 'ru' or the actual output language just for history logging
      });
      
      await checkIsSaved(text);

    } catch (e: any) {
      console.error(e);
      setError(e.message || t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: 'synonyms' | 'examples') => {
    setQaLoading(action);
    setError(null);
    try {
      const result = await ApiClient.quickAction(text, action, 'ru');
      setQaResults(prev => ({ ...prev, [action]: result }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('error'));
    } finally {
      setQaLoading(null);
    }
  };

  const handleToggleSave = async () => {
    if (!answer) return;
    
    if (isSaved) {
       const favorites = await StorageManager.getFavorites();
       const fav = favorites.find(f => f.text === text);
       if (fav) await StorageManager.removeFavorite(fav.id);
       setIsSaved(false);
    } else {
       await StorageManager.addFavorite({
         id: Date.now().toString(),
         text,
         answer,
         timestamp: new Date().toISOString()
       });
       setIsSaved(true);
    }
  };

  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    setText('');
    setAnswer(null);
    setError(null);
    setIsSaved(false);
    setQaResults({});
    window.speechSynthesis?.cancel();
  };

  if (answer) {
    return (
      <div className="p-5 flex flex-col h-full gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {t('result')}
            <button 
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-blue-400 bg-blue-500/10' : 'text-white/40 hover:text-white/80 hover:bg-white/10'}`}
              title={isSaved ? t('remove_card') : t('save_card')}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </h3>
          <Button onClick={handleReset} variant="secondary" className="!py-1.5 !px-3 text-sm flex gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('new_request')}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex gap-2 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm italic line-clamp-1">"{text}"</p>
            <button 
              onClick={() => handleSpeak(text)}
              className="text-white/40 hover:text-white/80 transition-colors"
              title={t('listen')}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        </div>

        <div className="flex gap-2">
          {!qaResults.synonyms && (
            <Button 
              onClick={() => handleQuickAction('synonyms')} 
              disabled={!!qaLoading}
              variant="secondary" 
              className="flex-1 !py-2 flex items-center justify-center gap-2 text-sm"
            >
              {qaLoading === 'synonyms' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : <List className="w-4 h-4" />}
              {t('synonyms')}
            </Button>
          )}
          {!qaResults.examples && (
            <Button 
              onClick={() => handleQuickAction('examples')} 
              disabled={!!qaLoading}
              variant="secondary" 
              className="flex-1 !py-2 flex items-center justify-center gap-2 text-sm"
            >
              {qaLoading === 'examples' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : <BookOpen className="w-4 h-4" />}
              {t('examples')}
            </Button>
          )}
        </div>

        {qaResults.synonyms && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <h4 className="font-bold text-blue-300 text-sm mb-2 flex items-center gap-2"><List className="w-4 h-4"/> {t('synonyms')}</h4>
            <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{qaResults.synonyms}</div>
          </motion.div>
        )}

        {qaResults.examples && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <h4 className="font-bold text-green-300 text-sm mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4"/> {t('examples')}</h4>
            <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{qaResults.examples}</div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col h-full gap-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          {t('what_to_explain')}
        </h2>
        <p className="text-white/60 text-sm">{t('paste_text')}</p>
      </div>

      {error && (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-200">{error}</p>
        </motion.div>
      )}

      <textarea
        className="w-full flex-1 min-h-[150px] bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        placeholder={t('enter_text_placeholder')}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button onClick={handleExplain} disabled={isLoading || !text.trim()} className="w-full py-3 text-base mt-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
             {t('analyzing')}
          </div>
        ) : t('explain_btn')}
      </Button>
    </div>
  );
};