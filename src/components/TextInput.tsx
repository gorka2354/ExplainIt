import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Scissors } from 'lucide-react';
import { Button } from './Layout';
import { User } from '../types';

interface TextInputProps {
  onSubmit: (text: string, shouldTruncate?: boolean) => void;
  user: User | null;
  initialText?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  onSubmit,
  user,
  initialText = '',
  disabled = false
}) => {
  const [text, setText] = useState(initialText);
  const [showTruncateDialog, setShowTruncateDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const characterLimit = user?.plan === 'pro' ? 50 : 15;
  const isOverLimit = text.length > characterLimit;
  const charactersLeft = characterLimit - text.length;

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (isOverLimit) {
      setShowTruncateDialog(true);
    } else {
      onSubmit(text);
    }
  };

  const handleTruncate = (shouldTruncate: boolean) => {
    setShowTruncateDialog(false);
    if (shouldTruncate) {
      const truncatedText = text.substring(0, characterLimit);
      setText(truncatedText);
      onSubmit(truncatedText, true);
    } else {
      onSubmit(text, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter text to explain..."
            disabled={disabled}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none min-h-[100px] max-h-[200px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !text.trim()}
            className="absolute bottom-3 right-3 p-2 !px-2 !py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className={`transition-colors ${
            isOverLimit ? 'text-red-400' : charactersLeft < 5 ? 'text-yellow-400' : 'text-white/60'
          }`}>
            {charactersLeft >= 0 ? `${charactersLeft} characters left` : `${Math.abs(charactersLeft)} characters over limit`}
          </span>
          
          {user?.plan === 'free' && (
            <span className="text-blue-400 text-xs">
              Upgrade to Pro for 50 chars
            </span>
          )}
        </div>
      </div>

      {showTruncateDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">Text Too Long</h3>
            </div>
            
            <p className="text-white/70 mb-6">
              Your text exceeds the {characterLimit}-character limit for {user?.plan === 'pro' ? 'Pro' : 'Free'} plan. 
              Would you like to truncate it or continue with the full text?
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => handleTruncate(true)}
                variant="primary"
                className="flex-1"
              >
                Truncate
              </Button>
              <Button
                onClick={() => handleTruncate(false)}
                variant="secondary"
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};