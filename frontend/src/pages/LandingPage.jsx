import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, FileText, CheckCircle, BarChart3, Lock, Star } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext.jsx';
import { SIMULATIONS } from '../data/simulations.js';

export default function LandingPage() {
  const { navigate, isDarkMode, setSelectedNiche: setGlobalNiche } = useApp();
  const [selectedNiche, setSelectedNiche] = useState('profissional');

  const handleTestClick = () => {
    setGlobalNiche(selectedNiche);
    navigate(SCREENS.DASHBOARD);
  };

  const niches = [
    { value: 'profissional', label: 'IA para Orientação Profissional' },
    { value: 'pme', label: 'IA para negócios (PMEs)' },
    { value: 'condominio', label: 'IA para gestão de condomínios' },
    { value: 'decisao', label: 'IA para tomada de decisão estratégica' },
    { value: 'financeiro', label: 'IA para análise financeira' }
  ];

  const features = [
    { title: 'Templates Prontos', desc: 'Analisar negócio, Tomar decisão, Resolver problema com 1 clique.', icon: Zap },
    { title: 'Histórico de Análises', desc: 'Acesse seus insights passados e acompanhe sua evolução.', icon: FileText },
    { title: 'Score de Recomendação', desc: 'Pontuação clara gerada pela IA para guiar sua decisão final.', icon: CheckCircle },
    { title: 'Insights Visuais', desc: 'Gráficos interativos, níveis de prioridade e cálculo de riscos.', icon: BarChart3 }
  ];

  return (
    <div className={`min-h-screen overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-antigravity-base text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background animado (dark mode) */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] left-[-5%] w-[35rem] h-[35rem] bg-[#2e1065]/20 rounded-full filter blur-[100px] animate-blob" />
          <div className="absolute top-[10%] right-[-10%] w-[50rem] h-[50rem] bg-[#064e3b]/15 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[15%] w-[45rem] h-[45rem] bg-[#1e1b4b]/20 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-16 md:mb-24">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className={`font-display font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>EquilibriumAI</span>
          </div>
          <button 
            onClick={() => navigate(SCREENS.DASHBOARD)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
          >
            Entrar
          </button>
        </header>

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <span className="inline-block py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
            Lançamento 2.0
          </span>
          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Tome decisões mais inteligentes com IA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-teal">em segundos</span>
          </h1>
          <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            O Equilibrium analisa dados e sugere ações estratégicas automaticamente para o seu negócio, carreira ou vida financeira.
          </p>

          <div className={`max-w-2xl mx-auto p-2 rounded-2xl md:rounded-full mb-8 flex flex-col md:flex-row gap-2 ${isDarkMode ? 'bg-antigravity-panel border border-antigravity-border' : 'bg-white shadow-xl border border-slate-200'}`}>
            <div className="relative flex-1 flex items-center">
              <select 
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className={`w-full pl-6 pr-10 py-4 rounded-xl md:rounded-l-full outline-none text-sm appearance-none cursor-pointer bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
              >
                {niches.map(niche => (
                  <option key={niche.value} value={niche.value} className={isDarkMode ? "bg-slate-800" : ""}>{niche.label}</option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none">
                <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <button 
              onClick={handleTestClick}
              className="bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-4 px-8 rounded-xl md:rounded-full transition-all shadow-lg shadow-brand-purple/25 active:scale-95 whitespace-nowrap"
            >
              Testar grátis
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-brand-teal" /> Sem cartão de crédito</span>
            <span className="flex items-center gap-1.5"><Lock size={14} className="text-brand-teal" /> Cancele quando quiser</span>
          </div>
        </motion.div>

        {/* FEATURES (PRODUTO) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className={`text-3xl font-display font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            O que torna o Equilibrium único?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-all hover:-translate-y-2 ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border hover:border-brand-purple/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-purple/30'}`}>
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-brand-purple" />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{feature.title}</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MONETIZATION / PLANOS */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className={`text-3xl font-display font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Escolha seu plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
            
            {/* Free */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Free</h3>
              <p className="text-sm text-slate-500 mb-6">Para testar o poder da IA.</p>
              <div className={`text-4xl font-display font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grátis</div>
              <ul className="space-y-4 text-sm text-slate-500 mb-8">
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-teal shrink-0" /> 2 pesquisas por dia</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-teal shrink-0" /> Acesso aos chats básicos</li>
                <li className="flex items-start gap-3 opacity-50"><CheckCircle size={18} className="text-slate-400 shrink-0" /> Sem histórico salvo</li>
              </ul>
              <button onClick={() => navigate(SCREENS.DASHBOARD)} className={`w-full py-4 rounded-xl font-bold border transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-800'}`}>Começar grátis</button>
            </div>

            {/* Pro */}
            <div className={`p-8 rounded-3xl border-2 relative transform md:-translate-y-4 ${isDarkMode ? 'bg-gradient-to-b from-brand-purple/20 to-antigravity-panel border-brand-purple' : 'bg-white border-brand-purple shadow-2xl'}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-purple text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Mais Popular</div>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pro</h3>
              <p className="text-sm text-slate-500 mb-6">Para uso pessoal avançado.</p>
              <div className={`text-4xl font-display font-bold mb-8 flex items-baseline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>R$ 29<span className="text-lg text-slate-400 font-normal ml-1">/mês</span></div>
              <ul className="space-y-4 text-sm text-slate-500 mb-8">
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-purple shrink-0" /> 5 pesquisas por dia</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-purple shrink-0" /> Histórico de análises</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-purple shrink-0" /> Templates prontos</li>
              </ul>
              <button onClick={() => navigate(SCREENS.DASHBOARD)} className="w-full py-4 rounded-xl font-bold bg-brand-purple hover:bg-brand-purple-light text-white transition-colors shadow-lg">Assinar Pro</button>
            </div>

            {/* Business */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Business</h3>
              <p className="text-sm text-slate-500 mb-6">Para empresas e equipes.</p>
              <div className={`text-4xl font-display font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sob consulta</div>
              <ul className="space-y-4 text-sm text-slate-500 mb-8">
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-teal shrink-0" /> Pesquisas ilimitadas</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-teal shrink-0" /> Dashboard & Gráficos</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-brand-teal shrink-0" /> Relatório PDF + WhatsApp</li>
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold border transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-800'}`}>Falar com consultor</button>
            </div>

          </div>
        </motion.div>

        {/* CASOS DE USO E PROVA SOCIAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className={`text-3xl font-display font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quem usa aprova</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-antigravity-panel/50' : 'bg-slate-50'}`}>
              <div className="flex gap-1 text-decision-gold mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className={`text-lg italic mb-6 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                "Como síndico, eu perdia horas analisando orçamentos. O Equilibrium cruzou os dados das propostas em segundos e me deu um score de risco e recomendação. Incrível."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-brand-purple">C</div>
                <div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Carlos M.</div>
                  <div className="text-xs text-slate-500">Síndico Profissional</div>
                </div>
              </div>
            </div>
            
            <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-antigravity-panel/50' : 'bg-slate-50'}`}>
              <div className="flex gap-1 text-decision-gold mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className={`text-lg italic mb-6 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                "Estávamos em dúvida se abríamos uma nova filial. Usamos a IA para tomada de decisão estratégica e os gráficos de risco nos ajudaram a esperar o melhor momento."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center font-bold text-brand-teal">A</div>
                <div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ana T.</div>
                  <div className="text-xs text-slate-500">Dona de PME</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className={`py-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm ${isDarkMode ? 'border-antigravity-border text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <span className="font-bold tracking-widest uppercase text-brand-purple">Criado por CidEngenharia</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-brand-teal transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-brand-teal transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
