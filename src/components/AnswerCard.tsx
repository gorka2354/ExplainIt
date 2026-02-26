import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, MessageSquare, BookOpen, Crown } from 'lucide-react';
import { Button } from './Layout';
import { ExplanationResponse, User } from '../types';

interface AnswerCardProps {
  response: ExplanationResponse;
  user: User | null;
  onStartChat?: () => void;
  onCopy?: () => void;
  onFeedback?: (positive: boolean) => void;
  showExamples?: boolean;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  response,
  user,
  onStartChat,
  onCopy,
  onFeedback,
  showExamples = false
}) => {
  const [showFullExamples, setShowFullExamples] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    onCopy?.();
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const isPro = user?.plan === 'pro';
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-6"
    >
      {/* Main explanation */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg">Explanation</h3>
          </div>
          <Button
            onClick={() => handleCopy(response.explanation, 'explanation')}
            variant="secondary"
            className="!p-2 !px-2 !py-2"
          >
            <Copy className={`w-4 h-4 ${copiedStates.explanation ? 'text-green-400' : ''}`} />
          </Button>
        </div>
        
        <p className="text-white/90 leading-relaxed mb-4">
          {response.explanation}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => onFeedback?.(true)}
              variant="secondary"
              className="!p-2 !px-2 !py-2"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onFeedback?.(false)}
              variant="secondary" 
              className="!p-2 !px-2 !py-2"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>

          {isPro && onStartChat && (
            <Button
              onClick={onStartChat}
              className="ml-auto flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat
            </Button>
          )}
        </div>
      </div>

      {/* Examples section - Pro feature */}
      {showExamples && response.examples && response.examples.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold">Examples</h3>
              {!isPro && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            {isPro && (
              <Button
                onClick={() => handleCopy(response.examples!.join('\n\n'), 'examples')}
                variant="secondary"
                className="!p-2 !px-2 !py-2"
              >
                <Copy className={`w-4 h-4 ${copiedStates.examples ? 'text-green-400' : ''}`} />
              </Button>
            )}
          </div>

          {isPro ? (
            <div className="space-y-3">
              {response.examples.slice(0, showFullExamples ? undefined : 2).map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <p className="text-white/80 text-sm leading-relaxed">
                    {example}
                  </p>
                </motion.div>
              ))}
              
              {response.examples.length > 2 && (
                <Button
                  onClick={() => setShowFullExamples(!showFullExamples)}
                  variant="secondary"
                  className="w-full"
                >
                  {showFullExamples ? 'Show Less' : `Show ${response.examples.length - 2} More Examples`}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-white/60 mb-4">Examples are available with Pro plan</p>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                Upgrade to Pro
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};