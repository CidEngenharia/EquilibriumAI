import React from 'react';

// ── Ícones inline ──────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const MenuIcon = () => <Icon d="M4 6h16M4 12h16M4 18h16" />;
const icons = {
  geral:         "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  psicologia:    "M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44A2.5 2.5 0 014.08 17a3 3 0 01-.34-5.58A2.5 2.5 0 015.06 7.18 2.5 2.5 0 019.5 2zM14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96.44A2.5 2.5 0 0019.92 17a3 3 0 00.34-5.58A2.5 2.5 0 0018.94 7.18 2.5 2.5 0 0014.5 2z",
  zen:           "M12 3a9 9 0 100 18M12 3a9 9 0 000 18M3.6 9h16.8M3.6 15h16.8",
  espiritualidade:"M12 2v20M7 7h10",
  gestao:        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  filosofia:     "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20",
  ikigai:        "M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0M12 2v3M12 19v3M2 12h3M19 12h3",
  star:          "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

// ── Grupos de navegação ─────────────────────────────────────────
const navGroups = [
  {
    label: 'Principal',
    items: [
      { id: 'geral',          label: 'Agente de Decisão' },
    ],
  },
  {
    label: 'Psicologia & Decisão',
    items: [
      { id: 'psicologia',     label: 'Vieses & Escolhas' },
    ],
  },
  {
    label: 'Sabedoria Japonesa',
    items: [
      { id: 'zen',            label: 'Ikigai · Kaizen · Wabi-sabi' },
      { id: 'ikigai',         label: 'Mapa Ikigai' },
    ],
  },
  {
    label: 'Espírito & Fé',
    items: [
      { id: 'espiritualidade', label: 'Princípios do Evangelho' },
    ],
  },
  {
    label: 'Mentalidade',
    items: [
      { id: 'filosofia',      label: 'Estoicismo & Filosofia' },
    ],
  },
  {
    label: 'Produtividade',
    items: [
      { id: 'gestao',         label: 'Métodos de Gestão' },
    ],
  },
];

// ── Sidebar ─────────────────────────────────────────────────────
const Sidebar = ({ activeContext, setActiveContext, isOpen, isDarkMode }) => {
  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 h-screen z-30 flex flex-col border-r
        ${isDarkMode ? 'bg-[#0a0a0c]/70 backdrop-blur-2xl border-[#1f1f23]/50' : 'bg-white/80 backdrop-blur-2xl border-slate-200/50'}
        transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden'}
      `}
    >
      {/* Logo */}
      <div className={`px-6 pt-6 pb-4 shrink-0 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-teal to-brand-lavender flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className={`font-display font-semibold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Equilibrium</p>
            <p className={`text-[10px] mt-0.5 tracking-wide uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Decisão Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.18em] font-medium px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = activeContext === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveContext(item.id)}
                    className={`
                      sidebar-item font-medium
                      ${isDarkMode 
                        ? (active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5')
                        : (active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50')
                      }
                    `}
                  >
                    <span className={`shrink-0 ${active ? 'text-brand-teal' : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                      <Icon d={icons[item.id] || icons.geral} size={15} />
                    </span>
                    <span className="text-[12.5px] truncate">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      <div className={`px-3 py-4 shrink-0 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
        <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-gradient-to-br from-brand-lavender/20 to-brand-teal/10 border-brand-lavender/20' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon d={icons.star} size={13} />
            <span className={`text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Equilibrium Pro</span>
          </div>
          <p className={`text-[10px] mb-3 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Consultas ilimitadas, histórico completo e técnicas exclusivas.
          </p>
          <button className="w-full bg-gradient-to-r from-brand-teal to-brand-lavender text-white text-[11px] font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
            Assinar agora
          </button>
        </div>
      </div>
    </aside>
  );
};

export { MenuIcon };
export default Sidebar;
