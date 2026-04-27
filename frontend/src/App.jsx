import React from 'react';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useApp, SCREENS } from './context/AppContext.jsx';

// ── Inner layout ────────────────────────────────────────────────────────────
function AppLayout() {
  const { isDarkMode, activeScreen } = useApp();

  if (activeScreen === SCREENS.LANDING) {
    return <LandingPage />;
  }

  return (
    <div className={`flex h-screen overflow-hidden relative transition-colors duration-300 ${
      isDarkMode ? 'dark bg-antigravity-base text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background animado (dark mode) - Fica atrás de tudo */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] left-[-5%] w-[35rem] h-[35rem] bg-[#2e1065]/25 rounded-full filter blur-[100px] animate-blob" />
          <div className="absolute top-[10%] right-[-10%] w-[50rem] h-[50rem] bg-[#064e3b]/20 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[15%] w-[45rem] h-[45rem] bg-[#1e1b4b]/30 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Sidebar Fixa à Esquerda */}
      <Sidebar />

      {/* Conteúdo Principal à Direita */}
      <Dashboard />
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
