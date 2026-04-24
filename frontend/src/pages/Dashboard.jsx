import React, { useState, useEffect } from 'react';
import Sidebar, { MenuIcon } from '../components/Sidebar.jsx';
import Chat from '../components/Chat.jsx';
import IkigaiDiagram from '../components/IkigaiDiagram.jsx';

const Dashboard = () => {
  const [activeContext, setActiveContext] = useState('geral');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('pt');

  const languages = {
    pt: { flag: 'https://flagcdn.com/w40/br.png', code: 'PT' },
    en: { flag: 'https://flagcdn.com/w40/us.png', code: 'EN' },
    es: { flag: 'https://flagcdn.com/w40/es.png', code: 'ES' }
  };

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
          <div className="absolute top-[-5%] left-[-5%] w-[35rem] h-[35rem] bg-[#064e3b]/40 rounded-full filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-[10%] right-[-10%] w-[50rem] h-[50rem] bg-[#2e1065]/50 rounded-full filter blur-[120px] opacity-80 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[15%] w-[55rem] h-[55rem] bg-[#022c22]/60 rounded-full filter blur-[120px] opacity-70 animate-blob animation-delay-4000"></div>
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
        <header className={`shrink-0 h-16 px-4 flex items-center justify-between border-b z-10 transition-colors backdrop-blur-2xl ${
          isDarkMode ? 'bg-[#0a0a0c]/40 border-white/5' : 'bg-white/60 border-slate-200/50 shadow-sm'
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
            {/* Language Switcher */}
            <div className="relative group">
              <button className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
                <img src={languages[language].flag} alt={language} className="w-5 h-auto rounded-sm" />
                <span className="text-xs font-bold">{languages[language].code}</span>
              </button>
              
              <div className={`absolute right-0 top-full mt-2 w-32 py-2 rounded-xl border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 backdrop-blur-xl ${
                isDarkMode ? 'bg-[#1a1a1c]/90 border-white/5' : 'bg-white/90 border-slate-100'
              }`}>
                {Object.entries(languages).map(([key, { flag, code }]) => (
                  <button
                    key={key}
                    onClick={() => setLanguage(key)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'
                    } ${language === key ? (isDarkMode ? 'text-brand-teal' : 'text-brand-teal font-bold') : ''}`}
                  >
                    <img src={flag} alt={code} className="w-5 h-auto rounded-sm" />
                    <span className="font-medium">{code}</span>
                  </button>
                ))}
              </div>
            </div>

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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-400' 
                : 'bg-slate-50 border-white text-slate-400 shadow-sm'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
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
