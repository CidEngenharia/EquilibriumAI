import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../services/api.js';

// ── Ícones ─────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Loading dots ────────────────────────────────────────────────
const LoadingDots = ({ isDarkMode }) => (
  <div className={`flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm w-fit animate-fade-in ${isDarkMode ? 'bg-antigravity-panel' : 'bg-white border border-slate-100 shadow-sm'}`}>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full animate-dot dot-${i} ${isDarkMode ? 'bg-slate-400' : 'bg-slate-300'}`}
      />
    ))}
  </div>
);

// ── Parser de resposta estruturada ──────────────────────────────
const SECTIONS = [
  { key: 'decisao',     label: 'Melhor decisão',      icon: '✔', color: 'text-brand-teal' },
  { key: 'porque',      label: 'Por quê',             icon: '✔', color: 'text-brand-teal' },
  { key: 'risco',       label: 'Risco',               icon: '⚠', color: 'text-amber-400' },
  { key: 'alternativa', label: 'Alternativa',         icon: '✔', color: 'text-brand-lavender' },
  { key: 'score',       label: 'Score de decisão',    icon: '★', color: 'text-yellow-400' },
  { key: 'tecnicas',    label: 'Técnicas utilizadas', icon: '🧠', color: 'text-indigo-400' }
];

function parseStructuredReply(text) {
  const sections = {};
  const labels = SECTIONS.map(s => s.label).join('|');
  SECTIONS.forEach(({ label }) => {
    const regex = new RegExp(`(?:✔|★|⚠|🧠)?\\s*${label}:\\s*(.+?)(?=(?:✔|★|⚠|🧠)?\\s*(?:${labels})|🔗|$)`, 'is');
    const match = text.match(regex);
    if (match) sections[label] = match[1].trim();
  });
  return Object.keys(sections).length >= 3 ? sections : null;
}

const DetailedScoreBar = ({ text, isDarkMode }) => {
  const scores = text.split(',').map(s => {
    const match = s.match(/(.*?):\s*(\d+)\s*\/\s*10/);
    if (match) return { label: match[1].trim(), score: parseInt(match[2], 10) };
    return null;
  }).filter(Boolean);

  if (scores.length === 0) return <span className="text-sm">{text}</span>;

  return (
    <div className="grid grid-cols-2 gap-4 mt-2">
      {scores.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <span>{item.label}</span>
            <span className={`${isDarkMode ? 'text-[#ff4500]' : 'text-orange-600'} font-bold`}>{item.score}/10</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isDarkMode ? 'bg-[#ff4500]' : 'bg-orange-500'
              }`}
              style={{ width: `${item.score * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const StructuredMessage = ({ text, isDarkMode }) => {
  const parsed = parseStructuredReply(text);
  if (!parsed) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
  }
  return (
    <div className="space-y-3">
      {SECTIONS.map(({ label, icon, color }) => {
        const value = parsed[label];
        if (!value) return null;
        return (
          <div key={label} className={`rounded-xl p-3 ${isDarkMode ? 'bg-antigravity-panel' : 'bg-slate-50'}`}>
            <div className={`flex items-center gap-1.5 mb-1 text-[11px] font-semibold uppercase tracking-wide ${color}`}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
            {label === 'Score de decisão' ? (
              <DetailedScoreBar text={value} isDarkMode={isDarkMode} />
            ) : (
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
            )}
          </div>
        );
      })}
      
      {text.includes('🔗') && (
        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-[#a855f7] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          Abrir Dashboard de Decisão
        </button>
      )}
    </div>
  );
};

// ── Mensagem individual ─────────────────────────────────────────
const Message = ({ msg, isDarkMode }) => {
  const isUser = msg.role === 'user';
  
  // Estilo WhatsApp com Glassmorphism
  const userStyle = isDarkMode 
    ? 'bg-[#005c4b]/80 backdrop-blur-md text-slate-100 rounded-tr-sm border border-white/5 shadow-sm' 
    : 'bg-[#dcf8c6]/90 backdrop-blur-md text-slate-900 rounded-tr-sm border border-white/40 shadow-sm';
    
  const agentStyle = isDarkMode
    ? 'bg-[#202c33]/80 backdrop-blur-md text-slate-200 rounded-tl-sm border border-white/5 shadow-sm'
    : 'bg-white/90 backdrop-blur-md text-slate-800 rounded-tl-sm border border-white/40 shadow-sm';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? userStyle : agentStyle}`}>
        {isUser ? (
          <p className="leading-relaxed">{msg.content}</p>
        ) : (
          <StructuredMessage text={msg.content} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};

// ── Sugestões rápidas por contexto ──────────────────────────────
const SUGGESTIONS = {
  geral:           ['Trabalho', 'Relacionamento', 'Financeiro', 'Propósito'],
  psicologia:      ['Estou procrastinando muito', 'Tenho medo de decidir errado', 'Como lidar com viés de confirmação'],
  zen:             ['Como encontrar meu Ikigai?', 'Aplicar Kaizen na rotina', 'O que é Wabi-sabi?'],
  espiritualidade: ['Fé e trabalho juntos', 'Como ter paz nas decisões', 'Propósito de vida cristão'],
  gestao:          ['Priorizar tarefas com Eisenhower', 'Montar meu sistema GTD', 'Definir OKRs pessoais'],
  filosofia:       ['Controle e aceitação estoica', 'Como parar de reclamar', 'Responsabilidade existencial'],
};

// ── Mensagem de boas-vindas por contexto ────────────────────────
const WELCOME = {
  geral:           'Olá! O EquilibriumAI utiliza um motor híbrido (Ikigai, Estoicismo, Psicologia e Evangelho) para te dar a melhor direção.\n\nQual área da sua vida precisa de clareza hoje?',
  psicologia:      'Vamos identificar os vieses que estão influenciando sua decisão. O que está passando pela sua mente?',
  zen:             'A sabedoria japonesa nos ensina que toda decisão carrega em si o caminho. Qual é o seu dilema?',
  espiritualidade: 'Buscaremos sabedoria nos princípios do Reino. O que está em seu coração?',
  gestao:          'Vamos aplicar as melhores metodologias de gestão ao seu desafio. Qual é a situação?',
  filosofia:       'Os grandes filósofos já enfrentaram dilemas como o seu. Qual questão você quer explorar?',
};

// ── Componente Chat principal ───────────────────────────────────
const Chat = ({ context, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll automático para nova mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize do textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setError('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const reply = await sendMessage(text, context, history);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const suggestions = SUGGESTIONS[context] || SUGGESTIONS.geral;
  const welcome = WELCOME[context] || WELCOME.geral;
  const isEmpty = messages.length === 0;

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-antigravity-base' : 'bg-slate-50'}`}>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">

        {/* Mensagem de boas-vindas */}
        <div className="flex justify-start animate-fade-in">
          <div className={`max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-[#202c33]/80 text-slate-200 border border-white/5' : 'bg-white/90 text-slate-800 border border-white/40'}`}>
            <p className="leading-relaxed">{welcome}</p>
          </div>
        </div>

        {/* Sugestões rápidas */}
        {isEmpty && (
          <div className="flex flex-wrap gap-2 pl-9 animate-fade-in">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-[1.02] active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-brand-teal/50 hover:text-brand-teal'
                    : 'border-slate-200 text-slate-500 hover:border-brand-teal/50 hover:text-brand-teal bg-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Mensagens do chat */}
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} isDarkMode={isDarkMode} />
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm backdrop-blur-md border animate-fade-in ${isDarkMode ? 'bg-[#202c33]/80 border-white/5' : 'bg-white/90 border-white/40'}`}>
              <LoadingDots isDarkMode={isDarkMode} />
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="flex justify-center animate-fade-in">
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 max-w-sm text-center">
              <AlertIcon />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className={`px-4 pb-4 pt-2 border-t shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50'}`}>
        <div className={`flex items-end gap-3 rounded-2xl border px-4 py-3 transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 focus-within:border-brand-teal/50'
            : 'bg-white border-slate-200 shadow-sm focus-within:border-brand-teal/50 focus-within:shadow-brand-teal/10'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Descreva sua situação ou decisão..."
            rows={1}
            className={`flex-1 resize-none bg-transparent border-none outline-none text-sm leading-relaxed placeholder:text-slate-400 max-h-32 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-700'
            }`}
            style={{ height: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
              isLoading || !input.trim()
                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                : 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-md'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
        <p className={`text-center text-[10px] mt-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};

export default Chat;
