import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Zap, History, Settings,
  Star, X, Menu
} from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext.jsx';

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { id: SCREENS.DASHBOARD, label: 'Dashboard',      Icon: LayoutDashboard },
      { id: SCREENS.DECISION,  label: 'Nova Decisão',   Icon: Zap },
    ],
  },
  {
    label: 'Histórico',
    items: [
      { id: SCREENS.HISTORY,  label: 'Minhas Decisões', Icon: History },
      { id: SCREENS.SETTINGS, label: 'Configurações',   Icon: Settings },
    ],
  },
];

// ── Menu flutuante ──────────────────────────────────────────────────────────
const FloatingMenu = () => {
  const { activeScreen, navigate, isDarkMode, isSidebarOpen, setIsSidebarOpen } = useApp();

  const close = () => setIsSidebarOpen(false);
  const toggle = () => setIsSidebarOpen(prev => !prev);

  // Variantes de animação do painel
  const panelVariants = {
    hidden:  { opacity: 0, scale: 0.92, y: 12 },
    visible: { opacity: 1, scale: 1,    y: 0   },
    exit:    { opacity: 0, scale: 0.92, y: 12  },
  };

  // Variante das linhas do hamburguer → X
  const topLineVariants    = { closed: { rotate: 0,   y: 0   }, open: { rotate: 45,  y: 6  } };
  const midLineVariants    = { closed: { opacity: 1,  x: 0   }, open: { opacity: 0,  x: -8 } };
  const bottomLineVariants = { closed: { rotate: 0,   y: 0   }, open: { rotate: -45, y: -6 } };

  return (
    <>
      {/* Overlay escuro ao abrir */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Painel flutuante */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={`
              fixed top-20 left-5 z-50 w-64 rounded-2xl border overflow-hidden
              shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              ${isDarkMode
                ? 'bg-antigravity-panel/95 backdrop-blur-2xl border-antigravity-border'
                : 'bg-white/95 backdrop-blur-2xl border-slate-200'
              }
            `}
          >
            {/* Logo header */}
            <div className={`px-4 pt-4 pb-3 flex items-center justify-between border-b ${
              isDarkMode ? 'border-antigravity-border' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`absolute left-4 w-10 h-10 rounded-full blur-2xl pointer-events-none ${
                  isDarkMode ? 'bg-brand-purple/40' : 'bg-brand-purple/20'
                }`} />
                <img
                  src="/equilibrium_1.fw.png"
                  alt="Logo"
                  className="h-8 w-auto relative z-10"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div>
                  <p className={`text-[11px] font-display font-semibold tracking-wider uppercase leading-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>Equilibrium</p>
                  <p className="text-[9px] text-brand-purple font-medium tracking-widest uppercase">AI</p>
                </div>
              </div>
              <button
                onClick={close}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-white/8' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav */}
            <nav className="px-2.5 py-3 space-y-4">
              {NAV_GROUPS.map((group, gIdx) => (
                <div key={group.label}>
                  <p className={`text-[9px] uppercase tracking-[0.18em] font-medium px-2.5 mb-1.5 ${
                    isDarkMode ? 'text-slate-600' : 'text-slate-400'
                  }`}>{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map(({ id, label, Icon }, idx) => {
                      const active = activeScreen === id;
                      return (
                        <motion.button
                          key={id}
                          onClick={() => { navigate(id); close(); }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: gIdx * 0.06 + idx * 0.05 }}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.97 }}
                          className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                        >
                          <Icon
                            size={15}
                            className={`shrink-0 ${active ? 'text-brand-purple' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                          />
                          <span className="truncate text-[13px]">{label}</span>
                          {active && (
                            <motion.span
                              layoutId="nav-dot"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* CTA Pro */}
            <div className={`px-2.5 pb-3 border-t pt-3 ${isDarkMode ? 'border-antigravity-border' : 'border-slate-100'}`}>
              <div className={`rounded-xl border p-3 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-brand-purple/20 to-brand-teal/10 border-brand-purple/25'
                  : 'bg-gradient-to-br from-brand-purple/5 to-brand-teal/5 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Star size={12} className="text-decision-gold" />
                  <span className={`text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Equilibrium Pro</span>
                </div>
                <p className={`text-[10px] mb-2.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Decisões ilimitadas, histórico e IA exclusiva.
                </p>
                <button className="w-full bg-brand-purple text-white text-[11px] font-medium py-1.5 rounded-lg hover:bg-brand-purple-dark transition-all">
                  Assinar agora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB: botão hambúrguer flutuante ─────────────────────────────────── */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`
          fixed top-5 left-5 z-50 w-12 h-12 rounded-xl
          flex items-center justify-center
          transition-colors duration-200
          ${isDarkMode
            ? 'bg-antigravity-panel border border-antigravity-border text-white'
            : 'bg-white border border-slate-200 text-slate-700 shadow-card-light'
          }
        `}
        style={{
          boxShadow: isSidebarOpen
            ? '0 0 0 3px rgba(168,85,247,0.4), 0 8px 32px rgba(0,0,0,0.4)'
            : isDarkMode
              ? '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.15)'
              : '0 4px 20px rgba(0,0,0,0.12)',
        }}
        aria-label="Menu"
      >
        {/* Ícone hambúrguer animado → X */}
        <div className="w-5 h-5 flex flex-col justify-center items-center gap-[5px]">
          <motion.span
            variants={topLineVariants}
            animate={isSidebarOpen ? 'open' : 'closed'}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="block w-5 h-[1.5px] bg-current rounded-full origin-center"
          />
          <motion.span
            variants={midLineVariants}
            animate={isSidebarOpen ? 'open' : 'closed'}
            transition={{ duration: 0.2 }}
            className="block w-5 h-[1.5px] bg-current rounded-full"
          />
          <motion.span
            variants={bottomLineVariants}
            animate={isSidebarOpen ? 'open' : 'closed'}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="block w-5 h-[1.5px] bg-current rounded-full origin-center"
          />
        </div>
      </motion.button>
    </>
  );
};

export { FloatingMenu as default };
