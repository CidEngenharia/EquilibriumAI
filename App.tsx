import React, { useState, useEffect, useMemo } from 'react';
import { IkigaiDiagram } from './components/IkigaiDiagram';
import { IkigaiItem, Category } from './types';
import { 
  analyzeIkigai, 
  getBibleVerse,
  getEquilibriumChatResponse
} from './services/geminiService';

// --- Types & Helper Components ---

const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);


const ChatConversation = ({ activeTab, input, setInput, history, isAnalyzing, onSend, placeholder, initialMessage, icon: IconComponent, ShareIcons, isDarkMode }: any) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const suggestions: Record<string, string[]> = {
    decisao: ["Mudar de carreira", "Investimento", "Dizer não"],
    psicologia: ["Procrastinação", "Ansiedade", "Foco"],
    evangelho: ["Esperança", "Trabalho", "Paz"],
    japonesa: ["Ikigai", "Kaizen", "Gaman"],
    mentalidade: ["Controle", "Crescimento", "Resiliência"],
    produtividade: ["Eisenhower", "Micro-hábitos", "Clareza"]
  };

  const currentSuggestions = suggestions[activeTab] || [];

  // Scroll instantâneo ao mudar de aba para focar nas mensagens recentes
  React.useEffect(() => {
    scrollToBottom('auto');
  }, [activeTab]);

  return (
    <div className="animate-fadeIn max-w-lg mx-auto px-2">
      <div className={`rounded-[32px] p-6 shadow-xl flex flex-col gap-6 h-[55vh] max-h-[500px] transition-colors ${isDarkMode ? 'bg-stone-900' : 'bg-[#e9eff6]'}`}>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
          {/* Mensagem Inicial (Bot) */}
          <div className="flex justify-start animate-fadeIn">
            <div className={`rounded-2xl p-4 shadow-sm max-w-[85%] relative min-w-[140px] transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-100' : 'bg-white text-stone-800'}`}>
              <p className="text-[13px] md:text-[14px] font-bold leading-tight">
                {initialMessage}
              </p>
              <div className="flex items-center justify-end mt-1">
                <span className="text-[10px] text-stone-400 font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Histórico da Conversa */}
          {history?.map((msg: any, i: number) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`rounded-2xl p-4 shadow-sm max-w-[85%] relative transition-all ${
                msg.role === 'user' 
                  ? `${isDarkMode ? 'bg-brand-teal text-white' : 'bg-[#dcf8c6] text-stone-800'}` 
                  : `${isDarkMode ? 'bg-stone-800 text-stone-100' : 'bg-white text-stone-800'}`
              }`}>
                <div className={`text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap ${msg.role === 'model' ? 'font-medium' : 'font-sans'}`}>
                  {msg.parts}
                </div>
                <div className="flex items-center justify-end mt-1">
                  <span className={`text-[10px] font-medium ${msg.role === 'user' ? (isDarkMode ? 'text-white/70' : 'text-stone-500') : 'text-stone-400'}`}>
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start animate-pulse">
              <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} rounded-2xl p-3 shadow-sm`}>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões Rápidas (Chips) */}
        {!isAnalyzing && history.length === 0 && currentSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fadeIn justify-center px-4">
            {currentSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => { setInput(s); }}
                className={`px-4 py-2 rounded-full text-[11px] font-medium transition-all border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10' 
                    : 'bg-white border-[#89e4b5] text-stone-700 hover:bg-[#89e4b5]/10 shadow-sm'}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Area WhatsApp Style Refined - Rounded Pill Style */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 flex items-center px-6 py-3 rounded-full shadow-sm transition-all ${isDarkMode ? 'bg-stone-800' : 'bg-white'}`}>
            <textarea 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => { 
                if(e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  onSend();
                  // Reset height after send
                  (e.target as any).style.height = 'auto';
                } 
              }}
              placeholder={placeholder || "Digite sua resposta..."}
              className={`flex-1 bg-transparent border-none focus:ring-0 outline-none p-0 text-[13px] md:text-[14px] resize-none max-h-32 placeholder:text-stone-300 font-normal transition-colors no-scrollbar ${isDarkMode ? 'text-white' : 'text-stone-600'}`}
              rows={1}
              style={{ height: 'auto' }}
            />
          </div>
          <button 
            onClick={onSend}
            disabled={isAnalyzing || !input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 shrink-0
              ${isAnalyzing ? 'bg-stone-100 text-stone-300' : 'bg-[#89e4b5] text-white hover:bg-[#76d3a2]'}`}
          >
            {isAnalyzing ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            ) : (
              <SendIcon className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Icon Library ---

const EnsoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a9 9 0 1 0 7.5 4.5" strokeDasharray="2 2" />
    <path d="M12 3a9 9 0 1 1-6 15.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
);

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
);



const GospelIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M7 7h10" />
  </svg>
);

const IkigaiIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="5" opacity="0.5" />
    <circle cx="15" cy="9" r="5" opacity="0.5" />
    <circle cx="9" cy="15" r="5" opacity="0.5" />
    <circle cx="15" cy="15" r="5" opacity="0.5" />
  </svg>
);

const KaizenIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16M7 16l3-3 3 3 4-4" />
    <path d="M17 12V8h-4" />
  </svg>
);

const WabiSabiIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" opacity="0.3" />
    <path d="M12 8c-2 2-2 5 0 7s4-1 4-3-2-4-4-4z" />
  </svg>
);

const KintsugiIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.5-1.5 2-4 2-5 0-3-2-5-5-5-1.5 0-3 .5-4 2-1-1.5-2.5-2-4-2-3 0-5 2-5 5 0 1 .5 3.5 2 5l7 7 7-7z" />
    <path d="M12 8l-2 4h4l-2 4" stroke="#D4AF37" />
  </svg>
);

const ShoshinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const StoicIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="18" width="16" height="3" rx="1" />
    <path d="M6 18V7h12v11M8 7V4h8v3" />
  </svg>
);

const GrowthIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10V3M12 3L9 6M12 3l3 6" />
    <path d="M5 14a7 7 0 0 0 14 0" />
    <path d="M12 21v-4" />
  </svg>
);

const MindfulnessIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity="0.2" />
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const LogotherapyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" strokeDasharray="2 2" />
    <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="currentColor" />
  </svg>
);

const SmartIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const DesignIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const AmazonIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
    <path d="M9 10l3 3 3-3" />
  </svg>
);

const CoffeeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);


const BrainIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16 5 21" />
    <path d="M7 16h10" />
    <path d="M12 3v13" />
    <path d="m19 16-11 5" />
    <circle cx="12" cy="20" r="1" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const SocialIcons = {
  Instagram: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  ),
  WhatsApp: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.503.893 3.129 1.364 4.799 1.365 5.421.002 9.835-4.411 9.838-9.835.002-2.628-1.022-5.1-2.885-6.963-1.862-1.863-4.334-2.888-6.962-2.889-5.424 0-9.838 4.412-9.841 9.835-.001 1.736.454 3.426 1.316 4.921l-1.008 3.684 3.743-.982zm11.367-6.727c-.31-.156-1.834-.905-2.112-1.006-.279-.101-.482-.156-.684.156-.202.311-.785 1.006-.962 1.206-.177.201-.355.226-.665.07-.31-.156-1.311-.484-2.498-1.543-.923-.824-1.546-1.841-1.727-2.152-.181-.311-.019-.479.136-.633.14-.139.31-.362.466-.544.156-.181.208-.311.31-.518.103-.207.051-.389-.026-.544-.077-.156-.684-1.656-.937-2.264-.247-.591-.497-.511-.684-.521-.177-.009-.38-.01-.582-.01-.202 0-.532.076-.811.38-.279.304-1.064 1.041-1.064 2.541 0 1.5 1.09 2.946 1.242 3.154.152.208 2.146 3.277 5.198 4.593.726.313 1.292.5 1.734.642.729.231 1.391.199 1.915.121.584-.087 1.834-.75 2.088-1.475.253-.725.253-1.346.177-1.475-.077-.129-.279-.207-.589-.363z"/></svg>
  ),
  X: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  LinkedIn: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
  )
};

// --- App Component ---
const DAILY_FREE_LIMIT = 5;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inicial');
  const [selectedNiche, setSelectedNiche] = useState<string>('profissional');
  const [ikigaiItems, setIkigaiItems] = useState<IkigaiItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [chatHistories, setChatHistories] = useState<Record<string, any[]>>({});
  
  const setInputFor = (tab: string, val: string) => setInputs(prev => ({ ...prev, [tab]: val }));
  const getInputFor = (tab: string) => inputs[tab] || '';

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isSidebarPersistent, setIsSidebarPersistent] = useState(true); 
  const [newItemText, setNewItemText] = useState('');
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsSidebarPersistent(isLarge);
      setIsSidebarOpen(isLarge);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkLimit = () => true;

  const techniqueGroups = [
    { 
      category: 'Essencial', 
      items: [
        { id: 'inicial', label: 'Início', icon: <InfoIcon /> },
        { id: 'decisao', label: 'Agente de Decisão', icon: <ScaleIcon /> }
      ] 
    },
    { 
      category: 'Psicologia & Decisão', 
      items: [
        { id: 'psicologia', label: 'Vieses & Escolhas', icon: <BrainIcon /> },
        { id: '101010', label: 'Regra 10/10/10', icon: <SmartIcon /> },
        { id: 'roda', label: 'Roda da Vida', icon: <MindfulnessIcon /> }
      ] 
    },
    { 
      category: 'Sabedoria Japonesa', 
      items: [
        { id: 'ikigai', label: 'Ikigai (Propósito)', icon: <IkigaiIcon /> },
        { id: 'kaizen', label: 'Kaizen (Melhoria)', icon: <KaizenIcon /> }, 
        { id: 'shikata', label: 'Shikata ga nai', icon: <WabiSabiIcon /> },
        { id: 'gaman', label: 'Gaman (Resiliência)', icon: <KintsugiIcon /> },
        { id: 'oubaitori', label: 'Oubaitori', icon: <ShoshinIcon /> },
        { id: 'hansei', label: 'Hansei (Reflexão)', icon: <InfoIcon /> }
      ] 
    },
    { 
      category: 'Evangelho & Espírito', 
      items: [
        { id: 'evangelho', label: 'Princípios do Reino', icon: <GospelIcon /> }
      ] 
    },
    { 
      category: 'Mentalidade & Filosofia', 
      items: [
        { id: 'estoicismo', label: 'Estoicismo', icon: <StoicIcon /> },
        { id: 'existencialismo', label: 'Existencialismo', icon: <GrowthIcon /> },
        { id: 'growth', label: 'Growth Mindset', icon: <TargetIcon /> }
      ] 
    },
    { 
      category: 'Produtividade & Gestão', 
      items: [
        { id: 'produtividade', label: 'Métodos de Gestão', icon: <SmartIcon /> },
        { id: 'design', label: 'Design Thinking', icon: <DesignIcon /> }
      ] 
    }
  ];

  const ShareIcons = ({ text }: { text: string }) => (
    <div className="mt-6 pt-3 border-t border-stone-100/50 flex items-center justify-end gap-3 opacity-60 hover:opacity-100 transition-opacity">
      <span className="text-[7px] font-normal text-stone-400 uppercase tracking-[0.2em]">Compartilhar</span>
      <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')} className="text-stone-300 hover:text-[#25D366] transition-colors"><SocialIcons.WhatsApp /></button>
      <button onClick={() => { navigator.clipboard.writeText(text); alert('Copiado!'); }} className="text-stone-300 hover:text-stone-600 transition-colors"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
    </div>
  );


  const runInteractiveAnalysis = async (area: string) => {
    if (!checkLimit()) return;
    const input = getInputFor(area);
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setInputFor(area, ''); 

    const currentHistory = chatHistories[area] || [];
    const newUserMsg = { role: 'user', parts: input };
    
    setChatHistories(prev => ({
      ...prev,
      [area]: [...(prev[area] || []), newUserMsg]
    }));

    try {
      const responseText = await getEquilibriumChatResponse(area, input, currentHistory);
      const newModelMsg = { role: 'model', parts: responseText };
      setChatHistories(prev => ({
        ...prev,
        [area]: [...(prev[area] || []), newModelMsg]
      }));
    } catch (error: any) {
      console.error("Erro no chat Equilibrium:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysis = async () => { 
    if (!checkLimit()) return; 
    setIsAnalyzing(true); 
    setAnalysis(await analyzeIkigai(ikigaiItems) || ''); 
    setIsAnalyzing(false); 
  };
  
  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-stone-950 text-white' : 'bg-stone-50 text-stone-900'}`}>
      {!isSidebarPersistent && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden animate-fadeIn" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#1c1c1c] z-[70] transition-all duration-300 ease-in-out shadow-2xl flex flex-col no-print 
          ${isSidebarOpen ? 'translate-x-0 w-72 opacity-100' : '-translate-x-full lg:translate-x-0 lg:w-0 opacity-0 overflow-hidden'} 
          ${!isSidebarPersistent ? 'shadow-black/50 translate-x-full' : ''}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 shrink-0">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center gap-3 hover:text-white transition-colors group">
             <span className="group-hover:scale-110 transition-transform"><MenuIcon /></span>
             <span className="text-white/70 font-logo text-sm tracking-[0.2em] uppercase">Menu</span>
           </button>
           {!isSidebarPersistent && (
             <button onClick={() => setIsSidebarOpen(false)} className="text-white/40 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
             </button>
           )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
          {techniqueGroups.map((group) => (
            <div key={group.category} className="mb-2">
              <h3 className="text-[8px] font-normal text-white/30 uppercase tracking-[0.25em] px-4 py-2 mt-2">{group.category}</h3>
              {group.items.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { 
                    if (item.id === 'assine') setIsLoginModalOpen(true);
                    else setActiveTab(item.id); 
                    if (!isSidebarPersistent) setIsSidebarOpen(false);
                  }} 
                  className={`w-full text-left px-4 py-2 my-0.5 rounded-xl transition-all flex items-center gap-3 border-l-4 ${activeTab === item.id ? 'bg-white/10 border-brand-lavender text-white shadow-lg' : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                >
                  <span className={`${activeTab === item.id ? 'text-brand-lavender' : 'text-stone-500'} scale-90`}>{item.icon}</span>
                  <span className="font-normal text-[11px] tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
           <button 
             onClick={() => setIsLoginModalOpen(true)}
             className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 bg-brand-lavender/10 border border-brand-lavender/20 text-brand-lavender hover:bg-brand-lavender/20 group"
           >
              <span className="text-brand-lavender group-hover:scale-110 transition-transform"><StarIcon /></span>
              <span className="font-normal text-[11px] tracking-tight">Atualize para plano Pro</span>
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full">
        <header className={`border-b py-3 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-sm backdrop-blur-md transition-all ${isDarkMode ? 'bg-stone-950/80 border-white/5' : 'bg-white/80 border-stone-100'}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-stone-400 hover:bg-white/5' : 'text-stone-600 hover:bg-stone-50'}`}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <div className="flex items-center gap-2">
             <img src="/equilibrium_1.fw.png" alt="Equilibrium" className={`h-20 object-contain transition-all duration-500 ${isDarkMode ? 'brightness-150 grayscale invert' : ''}`} />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button
               onClick={() => setIsDarkMode(!isDarkMode)}
               className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-brand-lavender shadow-brand-lavender/10' : 'bg-stone-50 border-stone-200 text-stone-500 shadow-stone-100'}`}
               title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
             >
               {isDarkMode ? <SunIcon /> : <MoonIcon />}
             </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 w-full max-w-4xl mx-auto flex flex-col">
          <div className="space-y-6">
            {activeTab === 'inicial' && (
              <div className="animate-fadeIn w-full">
                {/* HERO SECTION */}
                <div className={`rounded-[32px] p-8 md:p-12 mb-12 text-center shadow-xl ${isDarkMode ? 'bg-stone-900 border border-white/5' : 'bg-gradient-to-b from-brand-lavender/20 to-white border border-stone-100'}`}>
                  <span className="inline-block py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 bg-brand-teal/20 text-brand-teal">Lançamento</span>
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
                    Tome decisões mais inteligentes com IA <span className="text-brand-teal">em segundos</span>
                  </h1>
                  <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                    O Equilibrium analisa dados e sugere ações estratégicas automaticamente.
                  </p>

                  <div className={`max-w-md mx-auto p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-3 ${isDarkMode ? 'bg-stone-800' : 'bg-white shadow-sm border border-stone-100'}`}>
                    <select 
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className={`flex-1 p-3 rounded-xl outline-none text-sm appearance-none cursor-pointer ${isDarkMode ? 'bg-stone-900 text-white border-white/10' : 'bg-stone-50 text-stone-800 border-stone-200'} border focus:border-brand-teal transition-colors`}
                    >
                      <option value="profissional">IA para Orientação Profissional</option>
                      <option value="pme">IA para negócios (PMEs)</option>
                      <option value="condominio">IA para gestão de condomínios</option>
                      <option value="decisao">IA para tomada de decisão estratégica</option>
                      <option value="financeiro">IA para análise financeira</option>
                    </select>
                    <button 
                      onClick={() => {
                        if (selectedNiche === 'decisao') setActiveTab('decisao');
                        else setIsLoginModalOpen(true);
                      }}
                      className="bg-brand-teal hover:bg-[#76d3a2] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                      Testar grátis
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-medium text-stone-400">
                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Sem cartão de crédito</span>
                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Cancele quando quiser</span>
                  </div>
                </div>

                {/* PRODUTO (FEATURES) */}
                <div className="mb-16">
                  <h2 className={`text-2xl font-bold text-center mb-10 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>O que torna o Equilibrium único?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Templates Prontos', desc: 'Analisar negócio, Tomar decisão, Resolver problema com 1 clique.', icon: '⚡' },
                      { title: 'Histórico de Análises', desc: 'Acesse seus insights passados e acompanhe sua evolução.', icon: '📚' },
                      { title: 'Score de Recomendação', desc: 'Pontuação clara gerada pela IA para guiar sua decisão final.', icon: '🎯' },
                      { title: 'Insights Visuais', desc: 'Gráficos interativos, níveis de prioridade e cálculo de riscos.', icon: '📊' }
                    ].map((feature, i) => (
                      <div key={i} className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-stone-900 border-white/5 hover:border-brand-teal/50' : 'bg-white border-stone-100 hover:border-brand-teal/50 shadow-sm hover:shadow-md'}`}>
                        <div className="text-3xl mb-4">{feature.icon}</div>
                        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{feature.title}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MONETIZATION / PLANOS */}
                <div className="mb-16">
                  <h2 className={`text-2xl font-bold text-center mb-10 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Escolha seu plano</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free */}
                    <div className={`p-6 rounded-3xl border flex flex-col ${isDarkMode ? 'bg-stone-900 border-white/10' : 'bg-white border-stone-200 shadow-sm'}`}>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Free</h3>
                      <p className="text-sm text-stone-500 mb-6">Para testar o poder da IA.</p>
                      <div className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Grátis</div>
                      <ul className="space-y-3 text-sm text-stone-500 mb-8 flex-1">
                        <li className="flex gap-2"><span>✓</span> 2 pesquisas por dia</li>
                        <li className="flex gap-2"><span>✓</span> Acesso aos chats básicos</li>
                      </ul>
                      <button onClick={() => setActiveTab('decisao')} className={`w-full py-3 rounded-xl font-bold border transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-stone-200 hover:bg-stone-50 text-stone-800'}`}>Começar grátis</button>
                    </div>

                    {/* Pro */}
                    <div className={`p-6 rounded-3xl border-2 flex flex-col relative transform md:-translate-y-4 ${isDarkMode ? 'bg-stone-900 border-brand-teal' : 'bg-white border-brand-teal shadow-xl'}`}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-teal text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Mais Popular</div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Pro</h3>
                      <p className="text-sm text-stone-500 mb-6">Para uso pessoal avançado.</p>
                      <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>R$ 29<span className="text-lg text-stone-400 font-normal">/mês</span></div>
                      <ul className="space-y-3 text-sm text-stone-500 mb-8 flex-1 mt-5">
                        <li className="flex gap-2 text-brand-teal font-medium"><span>✓</span> 5 pesquisas por dia</li>
                        <li className="flex gap-2 text-stone-600 dark:text-stone-400"><span>✓</span> Histórico de análises</li>
                        <li className="flex gap-2 text-stone-600 dark:text-stone-400"><span>✓</span> Templates prontos</li>
                      </ul>
                      <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-3 rounded-xl font-bold bg-brand-teal hover:bg-[#76d3a2] text-white transition-colors shadow-lg">Assinar Pro</button>
                    </div>

                    {/* Business */}
                    <div className={`p-6 rounded-3xl border flex flex-col ${isDarkMode ? 'bg-stone-900 border-white/10' : 'bg-white border-stone-200 shadow-sm'}`}>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Business</h3>
                      <p className="text-sm text-stone-500 mb-6">Para empresas e equipes.</p>
                      <div className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Sob consulta</div>
                      <ul className="space-y-3 text-sm text-stone-500 mb-8 flex-1">
                        <li className="flex gap-2"><span>✓</span> Pesquisas ilimitadas</li>
                        <li className="flex gap-2"><span>✓</span> Dashboard & Gráficos</li>
                        <li className="flex gap-2"><span>✓</span> Score avançado</li>
                        <li className="flex gap-2"><span>✓</span> Relatório PDF + WhatsApp</li>
                      </ul>
                      <button className={`w-full py-3 rounded-xl font-bold border transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-stone-200 hover:bg-stone-50 text-stone-800'}`}>Falar com consultor</button>
                    </div>
                  </div>
                </div>

                {/* CASOS DE USO E PROVA SOCIAL */}
                <div className="mb-16">
                  <h2 className={`text-2xl font-bold text-center mb-10 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Quem usa aprova</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-stone-800' : 'bg-stone-50'}`}>
                      <div className="flex text-brand-teal mb-3">{'★'.repeat(5)}</div>
                      <p className={`italic mb-4 text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>"Como síndico, eu perdia horas analisando orçamentos. O Equilibrium cruzou os dados das propostas em segundos e me deu um score de risco e recomendação. Incrível."</p>
                      <div className="font-bold text-sm text-stone-500">- Carlos M., Síndico Profissional</div>
                    </div>
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-stone-800' : 'bg-stone-50'}`}>
                      <div className="flex text-brand-teal mb-3">{'★'.repeat(5)}</div>
                      <p className={`italic mb-4 text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>"Estávamos em dúvida se abríamos uma nova filial. Usamos a IA para tomada de decisão estratégica e os gráficos de risco nos ajudaram a esperar o melhor momento."</p>
                      <div className="font-bold text-sm text-stone-500">- Ana T., Dona de PME</div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <footer className={`mt-20 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${isDarkMode ? 'border-white/10 text-stone-500' : 'border-stone-200 text-stone-400'}`}>
                  <div>
                    <p className="font-typewriter italic mb-2">"E conhecereis a verdade, e a verdade vos libertará." <span className="not-italic opacity-70">João 8:32</span></p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <span className="font-bold tracking-widest uppercase">Criado por CidEngenharia</span>
                    <div className="flex gap-3">
                      <a href="#" className="hover:text-brand-teal transition-colors">Termos de Uso</a>
                      <a href="#" className="hover:text-brand-teal transition-colors">Política de Privacidade</a>
                    </div>
                  </div>
                </footer>
              </div>
            )}

            {activeTab === 'ikigai' && (
              <div className="animate-fadeIn space-y-8">
                 <div className="bg-white p-4 md:p-12 rounded-xl border border-stone-100 shadow-xl overflow-hidden">
                  <IkigaiDiagram activeCategory={activeCategory} onCategoryClick={(cat) => { setActiveCategory(cat); }} />
                </div>
                
                {activeCategory && (
                   <div className="bg-white p-6 md:p-10 rounded-xl border-2 border-brand-lavender/10 shadow-lg animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-logo font-normal text-lg md:text-xl text-stone-800 lowercase flex items-center gap-3">
                        {activeCategory === 'love' ? 'O que você ama' : activeCategory === 'goodAt' ? 'O que é bom' : activeCategory === 'worldNeeds' ? 'O que o mundo precisa' : 'O que gera renda'}
                      </h3>
                      <button onClick={() => setActiveCategory(null)} className="text-stone-300 hover:text-stone-500 text-[10px] font-normal tracking-widest">FECHAR</button>
                    </div>
                    <div className="flex gap-3 mb-8">
                      <input 
                        type="text" 
                        value={newItemText} 
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && newItemText.trim() && (setIkigaiItems(prev => [...prev, { id: Date.now().toString(), text: newItemText, category: activeCategory }]), setNewItemText(''))}
                        placeholder="Ex: Ler, Programar, Ensinar..."                         className="flex-1 border-2 border-stone-50 bg-stone-50 rounded-xl px-6 py-4 text-sm md:text-base outline-none focus:border-brand-lavender focus:bg-white transition-all"
                      />
                      <button 
                        onClick={() => newItemText.trim() && (setIkigaiItems(prev => [...prev, { id: Date.now().toString(), text: newItemText, category: activeCategory }]), setNewItemText(''))}                         className="bg-stone-900 text-white px-8 py-4 rounded-xl text-xs font-normal hover:bg-black transition-all shadow-md active:scale-95"
                      >Add</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!['inicial', 'ikigai', 'assine'].includes(activeTab) && (
              <div className="animate-fadeIn space-y-6">
                <div className="text-center">
                  <h3 className="text-sm md:text-base font-logo font-normal text-stone-800 lowercase tracking-tight">
                    {techniqueGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
                  </h3>
                </div>
                <ChatConversation 
                  activeTab={activeTab}
                  input={getInputFor(activeTab)}
                  setInput={(val: string) => setInputFor(activeTab, val)}
                  history={chatHistories[activeTab]}
                  isAnalyzing={isAnalyzing}
                  onSend={() => runInteractiveAnalysis(activeTab)}
                  icon={techniqueGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.icon?.type}
                  initialMessage={
                    activeTab === 'decisao' ? "Qual escolha está pesando hoje? Ex: Devo mudar de cidade?" :
                    activeTab === 'psicologia' ? "Compartilhe uma decisão ou pensamento. Analisaremos vieses e heurísticas." :
                    activeTab === 'evangelho' ? "O que está em seu coração? Buscaremos sabedoria nos princípios do Reino." :
                    "O que deseja analisar sob esta ótica?"
                  }
                  ShareIcons={ShareIcons}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>
        </main>

      </div>

      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
           <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border transition-colors ${isDarkMode ? 'bg-stone-900 border-white/10' : 'bg-white border-stone-100'}`}>
            <div className="p-6 border-b border-stone-100/10 flex items-center justify-between shrink-0">
               <h2 className={`text-xl font-logo font-normal lowercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>O Segredo do Equilibrium</h2>
               <button onClick={() => setIsLearnMoreOpen(false)} className="text-stone-400 hover:text-stone-600 text-2xl font-light">×</button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] no-scrollbar scroll-smooth">
               <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>O Equilibrium é uma plataforma de inteligência existencial que combina sabedoria milenar com tecnologia de ponta para ajudar você a encontrar clareza em meio ao caos.</p>
               <div className="grid grid-cols-1 gap-3">
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-stone-50 border-stone-100'}`}>
                    <h4 className="text-brand-teal font-logo mb-1 lowercase text-sm">Ikigai Dinâmico</h4>
                    <p className="text-[10px] text-stone-500">Mapeie seu propósito de vida com interatividade e profundidade tecnológica.</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-stone-50 border-stone-100'}`}>
                    <h4 className="text-brand-teal font-logo mb-1 lowercase text-sm">Sábios Digitais</h4>
                    <p className="text-[10px] text-stone-500">Consulte assistentes treinados em Estoicismo, Psicologia Cognitiva e Evangelho.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col border transition-colors ${isDarkMode ? 'bg-stone-900 border-white/10' : 'bg-white border-stone-100'}`}>
            <div className="p-6 border-b border-stone-100/10 flex items-center justify-between shrink-0">
               <h2 className={`text-xl font-logo font-normal lowercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Acesso SaaS Pro</h2>
               <button onClick={() => setIsLoginModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-2xl font-light">×</button>
            </div>
            <div className="p-6 space-y-4 text-center">
               <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Você atingiu o limite de {DAILY_FREE_LIMIT} consultas gratuitas diárias.</p>
               <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/10' : 'bg-brand-teal/5 border-brand-teal/10'}`}>
                  <h3 className="text-brand-teal font-logo text-base mb-1 lowercase">Equilibrium Pro</h3>
                  <p className="text-[10px] text-stone-500 mb-3 italic">Sabedoria ilimitada para sua jornada.</p>
                  <ul className="text-[9px] text-stone-500 space-y-1.5 mb-5 text-left list-disc list-inside">
                    <li>Consultas Ilimitadas</li>
                    <li>Histórico de Análises</li>
                    <li>Novas Técnicas Exclusivas</li>
                  </ul>
                  <button className="w-full bg-stone-900 text-white py-3 rounded-xl text-[10px] font-normal hover:bg-black transition-all shadow-md active:scale-95 uppercase tracking-widest">
                    Assinar Agora
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;