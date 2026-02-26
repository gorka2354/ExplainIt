import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ${className}`}
    >
      <div className="backdrop-blur-xl bg-black/20 min-h-screen">
        {children}
      </div>
    </motion.div>
  );
};

export const Card: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseClasses = "px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
    secondary: "bg-white/20 hover:bg-white/30 text-white focus:ring-white/50",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
};