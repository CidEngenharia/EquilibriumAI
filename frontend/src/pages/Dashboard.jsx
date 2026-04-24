import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, History, Settings, TrendingUp, Brain, Clock, ChevronRight } from 'lucide-react';
import Topbar from '../components/Topbar.jsx';
import DecisionWizard from '../components/DecisionWizard.jsx';
import HistoryPage from './HistoryPage.jsx';
import Chat from '../components/Chat.jsx';
import { useApp, SCREENS } from '../context/AppContext.jsx';

// ── Dashboard Home ──────────────────────────────────────────────────────────
const DashboardHome = ({ isDarkMode }) => {
  const { navigate, history } = useApp();

  const stats = [
    { label: 'Análises feitas', value: history.length, icon: TrendingUp, color: 'text-brand-teal' },
    { label: 'Motor de decisão', value: 'Ativo', icon: Brain, color: 'text-brand-purple' },
    { label: 'Tempo médio', value: '~30s', icon: Clock, color: 'text-decision-gold' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center space-y-3 py-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h1 className={`text-2xl font-display font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Bom dia, usuário 👋
          </h1>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            O EquilibriumAI está pronto para analisar sua próxima decisão.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, color }, idx) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.08 }}
            className={`rounded-2xl border p-4 text-center ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200 shadow-card-light'}`}>
            <Icon size={18} className={`${color} mx-auto mb-2`} />
            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
            <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA principal */}
      <motion.button
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(SCREENS.DECISION)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`w-full rounded-2xl border p-6 text-left transition-all group ${
          isDarkMode
            ? 'bg-gradient-to-br from-brand-purple/20 to-brand-teal/10 border-brand-purple/30 hover:border-brand-purple/50'
            : 'bg-gradient-to-br from-brand-purple/5 to-brand-teal/5 border-brand-purple/20 hover:border-brand-purple/40'
        }`}
        style={isDarkMode ? { boxShadow: '0 0 30px rgba(168,85,247,0.1)' } : {}}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
              <Zap size={22} className="text-brand-purple" />
            </div>
            <div>
              <p className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Nova análise de decisão</p>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Motor IA com 8 estratégias • Resultado em 30s</p>
            </div>
          </div>
          <ChevronRight size={20} className={`transition-transform group-hover:translate-x-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      </motion.button>

      {/* Histórico recente */}
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Decisões recentes</p>
            <button onClick={() => navigate(SCREENS.HISTORY)} className="text-[11px] text-brand-purple hover:underline">Ver todas</button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 2).map((item) => {
              const top = item.resultados?.[0];
              return (
                <div key={item.id} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200'}`}>
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0">
                    <TrendingUp size={14} className="text-brand-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{top?.nome}</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{item.timestamp}</p>
                  </div>
                  <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-brand-teal' : 'text-brand-teal-dark'}`}>{top?.scorePercent}/100</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Assistente de chat (contexto geral) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Assistente de sabedoria</p>
        <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'border-antigravity-border' : 'border-slate-200'}`} style={{ height: '380px' }}>
          <Chat context="geral" isDarkMode={isDarkMode} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Settings Page ───────────────────────────────────────────────────────────
const SettingsPage = ({ isDarkMode }) => {
  const { toggleDarkMode } = useApp();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto w-full space-y-4">
      <div className={`rounded-2xl border p-5 ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Aparência</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Modo escuro</p>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Alterna entre tema claro e escuro</p>
          </div>
          <button onClick={toggleDarkMode} className={`w-11 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-brand-purple' : 'bg-slate-200'} relative`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isDarkMode ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
      <div className={`rounded-2xl border p-5 ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sobre</h3>
        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          EquilibriumAI v2.0 — Motor de decisão inteligente com análise de perfil, scoring ponderado e simulação de cenários.
        </p>
      </div>
    </motion.div>
  );
};

// ── Main Dashboard ──────────────────────────────────────────────────────────
const SCREEN_TITLES = {
  [SCREENS.DASHBOARD]: 'Dashboard',
  [SCREENS.DECISION]:  'Nova Decisão',
  [SCREENS.HISTORY]:   'Histórico',
  [SCREENS.SETTINGS]:  'Configurações',
};

const Dashboard = () => {
  const { activeScreen, isDarkMode } = useApp();

  const renderContent = () => {
    switch (activeScreen) {
      case SCREENS.DECISION:  return <DecisionWizard isDarkMode={isDarkMode} />;
      case SCREENS.HISTORY:   return <HistoryPage isDarkMode={isDarkMode} />;
      case SCREENS.SETTINGS:  return <SettingsPage isDarkMode={isDarkMode} />;
      default:                return <DashboardHome isDarkMode={isDarkMode} />;
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      <Topbar title={SCREEN_TITLES[activeScreen]} />
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 lg:px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
