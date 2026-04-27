import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Zap, History, Settings, Brain, PanelLeftClose, PanelLeft,
  Wrench, BookOpen
} from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext.jsx';

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { id: SCREENS.DASHBOARD, label: 'Assistente de Decisão', Icon: LayoutDashboard },
      { id: SCREENS.DECISION,  label: 'Nova Decisão',   Icon: Zap },
      { id: SCREENS.ASSISTANT, label: 'Assistente de Sabedoria', Icon: Brain },
    ],
  },
  {
    label: 'Histórico',
    items: [
      { id: SCREENS.HISTORY,  label: 'Minhas Decisões', Icon: History },
      { id: SCREENS.SETTINGS, label: 'Configurações',   Icon: Settings },
    ],
  },
  {
    label: 'Ferramentas',
    items: [
      { id: SCREENS.SUPER_SEARCH, label: 'Busca Turbo', Icon: Zap },
      { id: SCREENS.TECHNIQUES, label: 'Técnicas', Icon: Wrench },
      { id: SCREENS.PHILOSOPHIES, label: 'Filosofias', Icon: BookOpen },
    ],
  },
];

const Sidebar = () => {
  const { activeScreen, navigate, isDarkMode, isSidebarOpen, setIsSidebarOpen } = useApp();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 260 : 0,
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`h-full flex-shrink-0 flex flex-col overflow-hidden border-r ${
          isDarkMode 
            ? 'bg-[#000000] border-white/5' 
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="w-[260px] flex-shrink-0 h-full flex flex-col p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-brand-purple" />
              <span className={`font-semibold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                EquilibriumAI
              </span>
            </div>
            <button 
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-brand-purple/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-4 scrollbar-thin">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={group.label}>
                <p className={`text-[10px] font-semibold px-3 mb-2 uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map(({ id, label, Icon }, idx) => {
                    const active = activeScreen === id;
                    return (
                      <button
                        key={id}
                        onClick={() => navigate(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                          active
                            ? (isDarkMode ? 'bg-[#2a1e35] text-white' : 'bg-brand-purple/10 text-brand-purple-dark')
                            : (isDarkMode ? 'text-slate-300 hover:bg-[#1a1423]' : 'text-slate-600 hover:bg-slate-100')
                        }`}
                      >
                        <Icon size={16} className={`${active ? 'text-brand-purple' : 'text-inherit'}`} />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Botão de abrir quando está colapsado (flutuante sobre o dashboard) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={toggleSidebar}
            className={`fixed top-4 left-4 z-50 p-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-[#000000] border-white/10 text-slate-400 hover:bg-[#1a1423]' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <PanelLeft size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
