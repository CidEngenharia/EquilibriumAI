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
  <div className={`flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm w-fit animate-fade-in ${isDarkMode ? 'bg-slate-800' : 'bg-white border border-slate-100 shadow-sm'}`}>
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
  { key: 'decisao',     label: 'Melhor decisão',  icon: '✔', color: 'text-brand-teal' },
  { key: 'justificativa', label: 'Justificativa', icon: '✔', color: 'text-brand-teal' },
  { key: 'riscos',      label: 'Riscos',           icon: '⚠', color: 'text-amber-400' },
  { key: 'alternativa', label: 'Alternativa',      icon: '✔', color: 'text-brand-lavender' },
  { key: 'score',       label: 'Score',            icon: '★', color: 'text-yellow-400' },
];

function parseStructuredReply(text) {
  // tenta extrair seções do formato "✔ Melhor decisão: ..."
  const sections = {};
  SECTIONS.forEach(({ label }) => {
    const regex = new RegExp(`(?:✔|★|⚠)?\\s*${label}:\\s*(.+?)(?=(?:✔|★|⚠)?\\s*(?:Melhor decisão|Justificativa|Riscos|Alternativa|Score)|$)`, 'is');
    const match = text.match(regex);
    if (match) sections[label] = match[1].trim();
  });
  return Object.keys(sections).length >= 3 ? sections : null;
}

const ScoreBar = ({ text }) => {
  const match = text?.match(/(\d+)\s*\/\s*10/);
  const score = match ? parseInt(match[1], 10) : null;
  if (!score) return <span className="text-sm">{text}</span>;
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-lavender transition-all duration-700"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-brand-teal shrink-0">{score}/10</span>
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
          <div key={label} className={`rounded-xl p-3 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <div className={`flex items-center gap-1.5 mb-1 text-[11px] font-semibold uppercase tracking-wide ${color}`}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
            {label === 'Score' ? (
              <ScoreBar text={value} />
            ) : (
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Mensagem individual ─────────────────────────────────────────
const Message = ({ msg, isDarkMode }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-lavender flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      )}
      <div className={`message-bubble ${isUser
        ? 'message-user'
        : isDarkMode ? 'message-ai-dark' : 'message-ai-light'
      }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <StructuredMessage text={msg.content} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};

// ── Sugestões rápidas por contexto ──────────────────────────────
const SUGGESTIONS = {
  geral:           ['Devo mudar de emprego?', 'Mudar de cidade vale a pena?', 'Abrir meu próprio negócio'],
  psicologia:      ['Estou procrastinando muito', 'Tenho medo de decidir errado', 'Como lidar com viés de confirmação'],
  zen:             ['Como encontrar meu Ikigai?', 'Aplicar Kaizen na rotina', 'O que é Wabi-sabi?'],
  espiritualidade: ['Fé e trabalho juntos', 'Como ter paz nas decisões', 'Propósito de vida cristão'],
  gestao:          ['Priorizar tarefas com Eisenhower', 'Montar meu sistema GTD', 'Definir OKRs pessoais'],
  filosofia:       ['Controle e aceitação estoica', 'Como parar de reclamar', 'Responsabilidade existencial'],
};

// ── Mensagem de boas-vindas por contexto ────────────────────────
const WELCOME = {
  geral:           'Olá! Qual decisão está pesando hoje? Descreva a situação e analisarei com múltiplas perspectivas.',
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
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">

        {/* Mensagem de boas-vindas */}
        <div className="flex justify-start animate-fade-in">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-lavender flex items-center justify-center shrink-0 mr-2 mt-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className={`message-bubble ${isDarkMode ? 'message-ai-dark' : 'message-ai-light'}`}>
            <p className="text-sm leading-relaxed">{welcome}</p>
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
                    ? 'border-slate-700 text-slate-300 hover:border-brand-teal/50 hover:text-brand-teal bg-slate-800/50'
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
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-lavender flex items-center justify-center shrink-0 mr-2 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <LoadingDots isDarkMode={isDarkMode} />
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
            ? 'bg-slate-900 border-slate-700 focus-within:border-brand-teal/50'
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
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 ${
              isLoading || !input.trim()
                ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-brand-teal to-brand-lavender text-white hover:opacity-90 shadow-md'
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
