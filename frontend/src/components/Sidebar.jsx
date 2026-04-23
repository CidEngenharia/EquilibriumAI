import React from 'react';

const Sidebar = ({ activeContext, onContextChange }) => {
  const menuItems = [
    { id: 'geral', label: 'Dashboard', icon: 'dashboard', category: 'Principal' },
    { id: 'dilema', label: 'Novo Dilema', icon: 'chat', category: 'Principal' },
    
    { id: 'psicologia', label: 'Psicologia & Decisão', icon: 'brain', category: 'Dimensões' },
    { id: 'zen', label: 'Filosofia Japonesa', icon: 'lotus', category: 'Dimensões' },
    { id: 'espiritualidade', label: 'Espiritualidade', icon: 'cross', category: 'Dimensões' },
    { id: 'gestao', label: 'Produtividade & Gestão', icon: 'stats', category: 'Dimensões' },
    { id: 'filosofia', label: 'Filosofia Ocidental', icon: 'shield', category: 'Dimensões' },
  ];

  const categories = ['Principal', 'Dimensões'];

  return (
    <div className="w-72 h-screen glass border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onContextChange('geral')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-fuchsia-400 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
             <span className="text-white font-normal text-xl">E</span>
          </div>
          <div>
            <h1 className="text-xl font-normal tracking-tight text-white leading-none">Equilibrium</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-normal">Decision Intelligence</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar">
        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <div className="text-[10px] font-normal text-slate-500 uppercase tracking-widest px-4 mb-3">{cat}</div>
            <nav className="space-y-1">
              {menuItems.filter(item => item.category === cat).map(item => (
                <NavItem 
                  key={item.id}
                  icon={item.icon} 
                  label={item.label} 
                  active={activeContext === item.id}
                  onClick={() => onContextChange(item.id)}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-12 h-12 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-colors"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-normal text-white shadow-inner">
              S
            </div>
            <div>
              <p className="text-xs font-normal text-white">Sidney Souza</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-slate-400 font-normal">Plano Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'dashboard': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
      case 'chat': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
      case 'brain': return <span className="text-lg">🧠</span>;
      case 'lotus': return <span className="text-lg">🧘</span>;
      case 'cross': return <span className="text-lg">✝️</span>;
      case 'stats': return <span className="text-lg">📊</span>;
      case 'shield': return <span className="text-lg">🛡️</span>;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
      active 
        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
    }`}>
      <span className={`${active ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {getIcon(icon)}
      </span>
      <span className="font-normal text-sm tracking-tight">{label}</span>
    </div>
  );
};

export default Sidebar;
