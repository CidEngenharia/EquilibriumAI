import React, { useState, useEffect } from 'react';
import Sidebar, { MenuIcon } from '../components/Sidebar.jsx';
import Chat from '../components/Chat.jsx';
import IkigaiDiagram from '../components/IkigaiDiagram.jsx';

const Dashboard = () => {
  const [activeContext, setActiveContext] = useState('geral');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fecha sidebar ao selecionar item no mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Applica classe dark no HTML global se necessário (opcional)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`flex h-screen overflow-hidden relative ${isDarkMode ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Animado Premium (Bolhas Lilás e Roxas) */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-lavender/10 rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-blob"></div>
          <div className="absolute top-[30%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activeContext={activeContext} 
        setActiveContext={(ctx) => {
          setActiveContext(ctx);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-transparent">
        
        {/* Header (Top bar) */}
        <header className={`shrink-0 h-16 px-4 flex items-center justify-between border-b z-10 transition-colors backdrop-blur-xl ${
          isDarkMode ? 'bg-[#0a0a0c]/80 border-slate-800/60' : 'bg-white/90 border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className={`p-2 -ml-2 rounded-lg lg:hidden transition-colors ${
                isDarkMode ? 'hover:bg-antigravity-panel text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <MenuIcon />
            </button>
            <h1 className="font-display font-semibold text-lg">
              {activeContext === 'ikigai' ? 'Mapa Ikigai' : 'Assistente de Decisão'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm border-2 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-brand-teal' 
                : 'bg-slate-50 border-white text-brand-teal shadow-sm'
            }`}>
              US
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-hidden relative ${isDarkMode ? 'bg-transparent' : 'bg-slate-50'}`}>
          {activeContext === 'ikigai' ? (
            <div className="h-full overflow-y-auto p-6 md:p-8">
              <IkigaiDiagram isDarkMode={isDarkMode} />
            </div>
          ) : (
            <Chat key={activeContext} context={activeContext} isDarkMode={isDarkMode} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
