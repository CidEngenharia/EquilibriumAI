import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, Loader2 } from 'lucide-react';
import { useApp, AI_STATUS } from '../context/AppContext.jsx';

const Topbar = ({ title }) => {
  const { isDarkMode, toggleDarkMode, aiStatus } = useApp();

  const statusConfig = {
    [AI_STATUS.IDLE]: {
      label: 'IA ativa',
      color: 'bg-emerald-400',
      pulse: true,
    },
    [AI_STATUS.THINKING]: {
      label: 'Processando...',
      color: 'bg-amber-400',
      pulse: true,
    },
    [AI_STATUS.DONE]: {
      label: 'Concluído',
      color: 'bg-brand-teal',
      pulse: false,
    },
  };

  const status = statusConfig[aiStatus] || statusConfig[AI_STATUS.IDLE];

  return (
    <header className={`
      shrink-0 h-14 px-5 lg:px-8 flex items-center justify-between border-b z-10
      transition-colors backdrop-blur-2xl
      ${isDarkMode
        ? 'bg-antigravity-base/70 border-antigravity-border'
        : 'bg-white/80 border-slate-200/60 shadow-sm'
      }
    `}>
      {/* Left: title */}
      <AnimatePresence mode="wait">
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className={`font-display font-semibold text-base tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          {title}
        </motion.h1>
      </AnimatePresence>

      {/* Right: status + theme + avatar */}
      <div className="flex items-center gap-2">
        {/* AI Status indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
            isDarkMode
              ? 'bg-white/5 border border-white/8 text-slate-300'
              : 'bg-slate-100 border border-slate-200 text-slate-600'
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {status.pulse && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.color} opacity-75`} />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.color}`} />
          </span>
          {aiStatus === AI_STATUS.THINKING ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={10} className="animate-spin" />
              {status.label}
            </span>
          ) : (
            <span>{status.label}</span>
          )}
        </motion.div>

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode
              ? 'bg-white/5 border border-white/8 text-amber-400 hover:bg-white/10'
              : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* User avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
          isDarkMode
            ? 'bg-antigravity-surface border-antigravity-border text-slate-400'
            : 'bg-slate-100 border-white text-slate-500 shadow-sm'
        }`}>
          <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
