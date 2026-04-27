import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, User } from 'lucide-react';
import { useApp, AI_STATUS, SCREENS } from '../context/AppContext.jsx';

const SCREEN_TITLES = {
  [SCREENS.DASHBOARD]: 'Assistente de Decisão',
  [SCREENS.DECISION]:  'Nova Decisão',
  [SCREENS.HISTORY]:   'Minhas Decisões',
  [SCREENS.SETTINGS]:  'Configurações',
  [SCREENS.SUPER_SEARCH]: 'Busca Turbo',
  [SCREENS.ASSISTANT]: 'Assistente de Sabedoria',
  [SCREENS.TECHNIQUES]: 'Técnicas de Análise',
  [SCREENS.PHILOSOPHIES]: 'Filosofias de Vida',
};

const Topbar = () => {
  const { isDarkMode, toggleDarkMode, aiStatus, activeScreen } = useApp();

  const statusConfig = {
    [AI_STATUS.IDLE]: {
      label: 'IA ativa',
      color: 'bg-emerald-500',
      ping: true
    },
    [AI_STATUS.THINKING]: {
      label: 'IA pensando...',
      color: 'bg-brand-purple',
      ping: false
    },
    [AI_STATUS.ERROR]: {
      label: 'Erro na IA',
      color: 'bg-rose-500',
      ping: false
    }
  };

  const currentStatus = statusConfig[aiStatus] || statusConfig[AI_STATUS.IDLE];

  return (
    <header className={`
      shrink-0 h-16 px-5 lg:px-8 flex items-center border-b z-40
      transition-all duration-300 backdrop-blur-2xl sticky top-0
      ${isDarkMode
        ? 'bg-antigravity-base/80 border-antigravity-border'
        : 'bg-white/90 border-slate-200/60 shadow-sm'
      }
    `}>
      
      {/* ── Screen Title (Centralizado) ─────────────────────────────────── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
        <h2 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {SCREEN_TITLES[activeScreen] || 'EquilibriumAI'}
        </h2>
      </div>

      {/* ── Right Actions ──────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-3">
        {/* IA Status Indicator */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="relative flex">
            <div className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
            {currentStatus.ping && (
              <div className={`absolute inset-0 w-2 h-2 rounded-full ${currentStatus.color} animate-ping opacity-75`} />
            )}
          </div>
          <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl border transition-all ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 text-decision-gold hover:bg-white/10' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* User Avatar */}
        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center overflow-hidden transition-all ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <User size={20} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
        </div>
      </div>
    </header>
  );
};

export { Topbar as default };
