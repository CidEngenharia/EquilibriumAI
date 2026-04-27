import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Tipos de telas disponíveis ──────────────────────────────────────────────
export const SCREENS = {
  LANDING: 'landing',
  DASHBOARD: 'dashboard',
  DECISION: 'decision',
  HISTORY: 'history',
  SETTINGS: 'settings',
  SUPER_SEARCH: 'super-search',
  ASSISTANT: 'assistant',
  TECHNIQUES: 'techniques',
  PHILOSOPHIES: 'philosophies',
};

// ── Status da IA ────────────────────────────────────────────────────────────
export const AI_STATUS = {
  IDLE: 'idle',         // IA ativa
  THINKING: 'thinking', // Processando...
  DONE: 'done',         // Concluído
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState(SCREENS.LANDING);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [aiStatus, setAiStatus] = useState(AI_STATUS.IDLE);
  const [history, setHistory] = useState([]);
  const [assistantInitialMessages, setAssistantInitialMessages] = useState(null);
  const [selectedNiche, setSelectedNiche] = useState('profissional');

  // Navega para uma tela e fecha sidebar no mobile
  const navigate = useCallback((screen, options = {}) => {
    setActiveScreen(screen);
    if (options.initialMessages) {
      setAssistantInitialMessages(options.initialMessages);
    } else {
      setAssistantInitialMessages(null);
    }
    if (options.niche) {
      setSelectedNiche(options.niche);
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  // Salva uma decisão finalizada no histórico
  const saveDecision = useCallback((decision) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        ...decision,
      },
      ...prev,
    ]);
  }, []);

  // Remove item do histórico
  const removeDecision = useCallback((id) => {
    setHistory((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }, []);

  const value = {
    activeScreen,
    navigate,
    isDarkMode,
    toggleDarkMode,
    isSidebarOpen,
    setIsSidebarOpen,
    aiStatus,
    setAiStatus,
    history,
    saveDecision,
    removeDecision,
    selectedNiche,
    setSelectedNiche,
    assistantInitialMessages,
    setAssistantInitialMessages
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
