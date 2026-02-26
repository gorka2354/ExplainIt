import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, History, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onProfileClick: () => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSettingsClick,
  onHistoryClick,
  onProfileClick,
  currentView
}) => {
  return (
    <motion.header 
      className="flex items-center justify-between p-4 border-b border-white/10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ExplainIt
          </h1>
          {user && (
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className={`px-2 py-0.5 rounded-full ${user.plan === 'pro' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {user.plan.toUpperCase()}
              </span>
              <span>{user.charactersUsed}/{user.charactersLimit} chars</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHistoryClick}
          className={`p-2 rounded-xl transition-colors ${
            currentView === 'history' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'hover:bg-white/10 text-white/60'
          }`}
        >
          <History className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
          className={`p-2 rounded-xl transition-colors ${
            currentView === 'settings' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'hover:bg-white/10 text-white/60'
          }`}
        >
          <Settings className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
          className={`p-2 rounded-xl transition-colors ${
            currentView === 'profile' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'hover:bg-white/10 text-white/60'
          }`}
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
};