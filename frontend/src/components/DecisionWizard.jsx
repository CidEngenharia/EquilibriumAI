import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, Loader2, Lightbulb,
  Briefcase, Building2, TrendingUp, Brain, DollarSign
} from 'lucide-react';
import { processarDecisao } from '../core/decisionEngine.js';
import { useApp, AI_STATUS } from '../context/AppContext.jsx';
import ResultsPanel from './ResultsPanel.jsx';
import { NICHE_WIZARDS, NICHE_LABELS } from '../data/nicheWizards.js';

// ── Nicho selector ──────────────────────────────────────────────
const NICHE_ICONS = {
  profissional: Briefcase,
  pme: TrendingUp,
  condominio: Building2,
  decisao: Brain,
  financeiro: DollarSign,
};

// ── Loader steps ────────────────────────────────────────────────
const LOADER_STEPS = [
  'Analisando seu perfil...',
  'Calculando cenários de risco...',
  'Comparando estratégias...',
  'Gerando sua decisão personalizada...',
];

// ── Typing effect ───────────────────────────────────────────────
function useTypingEffect(text, speed = 22) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return displayed;
}

// ── WizardMessage ───────────────────────────────────────────────
const WizardMessage = ({ text, isDarkMode }) => {
  const displayed = useTypingEffect(text);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
      <div className={`max-w-[88%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed ${isDarkMode ? 'bg-antigravity-panel border border-antigravity-border text-slate-200' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>
        {displayed}
        {displayed.length < text.length && <span className="inline-block w-0.5 h-4 bg-brand-purple ml-0.5 animate-pulse align-middle" />}
      </div>
    </motion.div>
  );
};

// ── OptionCard ──────────────────────────────────────────────────
const OptionCard = ({ item, selected, onSelect, isDarkMode }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(item.id)}
    className={`wizard-option text-left w-full ${selected
      ? (isDarkMode ? 'wizard-option-selected-dark' : 'wizard-option-selected-light')
      : (isDarkMode ? 'wizard-option-dark' : 'wizard-option-light')
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="text-[13px] font-medium">{item.label}</p>
        {item.desc && <p className={`text-[11px] mt-0.5 ${selected ? 'opacity-70' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>}
      </div>
      {selected && <Check size={16} className="text-brand-purple shrink-0" />}
    </div>
  </motion.button>
);

// ── LoadingScreen ───────────────────────────────────────────────
const LoadingScreen = ({ isDarkMode }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const si = setInterval(() => setStepIdx(p => { if (p < LOADER_STEPS.length - 1) return p + 1; clearInterval(si); return p; }), 750);
    const pi = setInterval(() => setProgress(p => Math.min(p + 2, 98)), 58);
    return () => { clearInterval(si); clearInterval(pi); };
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-8">
      <div className="relative">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-antigravity-surface' : 'bg-slate-100'}`}>
          <Loader2 size={32} className="text-brand-purple animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 30px rgba(168,85,247,0.3)' }} />
      </div>
      <div className="space-y-3 w-full max-w-xs">
        {LOADER_STEPS.map((s, idx) => (
          <motion.div key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: idx <= stepIdx ? 1 : 0.25, x: 0 }} transition={{ delay: idx * 0.15 }} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${idx < stepIdx ? 'bg-emerald-500' : idx === stepIdx ? 'bg-brand-purple animate-pulse' : isDarkMode ? 'bg-antigravity-border' : 'bg-slate-200'}`}>
              {idx < stepIdx ? <Check size={11} className="text-white" /> : <span className={`w-1.5 h-1.5 rounded-full ${idx === stepIdx ? 'bg-white' : ''}`} />}
            </div>
            <p className={`text-sm ${idx <= stepIdx ? (isDarkMode ? 'text-slate-200' : 'text-slate-700') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>{s}</p>
          </motion.div>
        ))}
      </div>
      <div className={`w-full max-w-xs h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-antigravity-border' : 'bg-slate-200'}`}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #8ec6c5, #a855f7)', transition: 'width 0.1s linear' }} />
      </div>
    </motion.div>
  );
};

// ── DecisionWizard principal ────────────────────────────────────
const DecisionWizard = ({ isDarkMode }) => {
  const { setAiStatus, saveDecision, selectedNiche, setSelectedNiche } = useApp();
  const [step, setStep] = useState(0);
  const [perfil, setPerfil] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const bottomRef = useRef(null);

  const steps = NICHE_WIZARDS[selectedNiche] || NICHE_WIZARDS.profissional;

  // Resetar perfil ao trocar nicho
  const handleNicheChange = (niche) => {
    setSelectedNiche(niche);
    setStep(0);
    setPerfil({});
    setResults(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, isLoading]);

  const update = (key, val) => setPerfil(p => ({ ...p, [key]: val }));
  const current = steps[step];

  const finalize = async () => {
    setIsLoading(true);
    setAiStatus(AI_STATUS.THINKING);
    await new Promise(r => setTimeout(r, 3400));
    const res = processarDecisao({ ...perfil, nicho: selectedNiche });
    setResults(res);
    saveDecision({ perfil: { ...perfil, nicho: selectedNiche }, resultados: res });
    setIsLoading(false);
    setAiStatus(AI_STATUS.DONE);
  };

  const reset = () => {
    setStep(0);
    setPerfil({});
    setResults(null);
    setAiStatus(AI_STATUS.IDLE);
  };

  if (results) return <ResultsPanel results={results} perfil={perfil} onReset={reset} isDarkMode={isDarkMode} />;
  if (isLoading) return <LoadingScreen isDarkMode={isDarkMode} />;

  const canNext = !!perfil[current?.key];

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto w-full">

      {/* Seletor de Nicho */}
      <div className={`rounded-xl border p-3 ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200'}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Área de análise
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Object.entries(NICHE_LABELS).map(([key, label]) => {
            const Icon = NICHE_ICONS[key];
            const active = selectedNiche === key;
            return (
              <button
                key={key}
                onClick={() => handleNicheChange(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition-all text-left ${
                  active
                    ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/40'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-white/5 border border-transparent'
                      : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon size={13} className="shrink-0" />
                <span className="truncate leading-tight">{label.replace('IA para ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-purple' : isDarkMode ? 'bg-antigravity-border' : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className={`text-[11px] text-center -mt-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        Etapa {step + 1} de {steps.length} · {NICHE_LABELS[selectedNiche]}
      </p>

      {/* Perguntas */}
      <div className="space-y-4">
        {steps.slice(0, step).map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="flex justify-start">
            <div className={`text-[11px] px-3 py-1.5 rounded-xl ${isDarkMode ? 'bg-antigravity-panel text-slate-500' : 'bg-slate-100 text-slate-400'}`}>{s.message}</div>
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
          <WizardMessage key={`${selectedNiche}-${step}`} text={current.message} isDarkMode={isDarkMode} />
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 gap-2"
        >
          {current.options.map((opt, i) => (
            <motion.div key={opt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
              <OptionCard
                item={opt}
                selected={perfil[current.key] === opt.id}
                onSelect={v => update(current.key, v)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navegação */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s => s - 1)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${isDarkMode ? 'btn-ghost-dark' : 'btn-ghost-light'}`}
          >
            <ChevronLeft size={16} /> Voltar
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={current.isLast ? finalize : () => setStep(s => s + 1)}
          disabled={!canNext}
          className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {current.isLast
            ? <><Lightbulb size={16} /> Analisar e gerar decisão</>
            : <>Próximo <ChevronRight size={16} /></>
          }
        </motion.button>
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default DecisionWizard;
