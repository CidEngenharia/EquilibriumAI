import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';

const Chat = ({ context = 'geral' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const getInitialMessage = (ctx) => {
    switch(ctx) {
      case 'psicologia': return 'Olá! Sou seu consultor de Psicologia & Decisão. Qual dilema ou viés cognitivo quer explorar hoje?';
      case 'zen': return 'Konnichiwa. Sou seu guia em Filosofia Japonesa. Vamos encontrar seu Ikigai ou aplicar o Kaizen em sua vida?';
      case 'espiritualidade': return 'Bem-vindo ao modo de Espiritualidade Prática. Como os ensinamentos do Evangelho podem iluminar seus valores hoje?';
      case 'gestao': return 'Sistema de Gestão & Produtividade ativo. Pronto para OKRs, Matrix de Eisenhower ou GTD? Qual o plano?';
      case 'filosofia': return 'Saudações. Sou seu tutor de Filosofia Ocidental. Foco no Estoicismo ou na responsabilidade Existencialista?';
      case 'dilema': return 'Novo Dilema detectado. Descreva a situação e vamos analisá-la sob múltiplas lentes.';
      default: return 'Olá! Sou o Equilibrium, seu consultor de decisões multisetorial. Como posso ajudar hoje?';
    }
  };

  useEffect(() => {
    setMessages([{ role: 'ai', content: getInitialMessage(context) }]);
  }, [context]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content) => {
    if (!content.includes('✔')) {
      return <div className="text-sm leading-relaxed whitespace-pre-wrap">{content}</div>;
    }

    const sections = content.split('✔').filter(s => s.trim());
    return (
      <div className="space-y-4 py-2">
        {sections.map((section, idx) => {
          const [title, ...textParts] = section.split(':');
          const text = textParts.join(':').trim();
          
          if (title.toLowerCase().includes('score')) {
            return (
              <div key={idx} className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Avaliação de Risco</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-normal border border-emerald-500/20">
                  Score: {text}
                </span>
              </div>
            );
          }

          return (
            <div key={idx} className="group/item">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-emerald-400 text-sm">✔</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-normal">
                  {title.trim()}
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed pl-5 border-l border-white/5 group-hover/item:border-emerald-500/30 transition-colors">
                {text}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await sendMessage(userMessage, context);
      setMessages(prev => [...prev, { role: 'ai', content: response.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Houve um erro na conexão com o oráculo. Verifique se o servidor backend está ativo.', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] glass border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/5 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -right-0.5 -bottom-0.5 border-2 border-slate-900 z-20 animate-pulse"></div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
          </div>
          <div>
            <p className="text-xs font-normal text-slate-400">Equilibrium AI</p>
            <p className="text-[10px] text-slate-500 font-normal uppercase tracking-widest">{context === 'geral' ? 'Multisetorial' : context}</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar relative z-10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className={`max-w-[85%] group flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`px-5 py-4 rounded-[20px] shadow-sm transition-all ${
                 msg.role === 'user' 
                   ? 'bg-[#2D2E3A] text-white border border-white/5' 
                   : msg.isError 
                     ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                     : 'bg-[#3D3E4A] text-slate-100 border border-white/5'
               }`}>
                  {formatMessage(msg.content)}
               </div>
               <span className="text-[10px] text-slate-500 mt-2 block px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {msg.role === 'user' ? 'Você' : 'Equilibrium'}
               </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-in">
            <div className="bg-[#3D3E4A] border border-white/5 px-5 py-4 rounded-[20px] flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="p-8 bg-gradient-to-t from-slate-900/50 to-transparent z-10">
        <div className="relative group flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="w-full bg-[#1E1F26] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 flex-shrink-0"
          >
            <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
