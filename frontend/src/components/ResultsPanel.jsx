import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, TrendingUp, TrendingDown, Minus, RotateCcw, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';

// ── Score Badge ─────────────────────────────────────────────────────────────
const ScoreBadge = ({ score, size = 'md' }) => {
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const sizes = { sm: 'w-12 h-12 text-base', md: 'w-20 h-20 text-2xl', lg: 'w-24 h-24 text-3xl' };
  return (
    <div className={`${sizes[size]} rounded-full border-4 flex items-center justify-center font-bold relative`}
      style={{ borderColor: color, color, boxShadow: `0 0 20px ${color}33` }}>
      {score}
    </div>
  );
};

// ── Scenario Card ───────────────────────────────────────────────────────────
const ScenarioRow = ({ label, value, icon: Icon, color, isDarkMode }) => (
  <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${isDarkMode ? 'bg-antigravity-surface' : 'bg-slate-50'}`}>
    <div className="flex items-center gap-2">
      <Icon size={14} className={color} />
      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    </div>
    <span className={`text-sm font-semibold ${color}`}>
      R$ {value.toLocaleString('pt-BR')}
    </span>
  </div>
);

// ── Result Card ─────────────────────────────────────────────────────────────
const ResultCard = ({ opt, isDarkMode, isTop }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: opt.posicao * 0.1 }}
      className={`rounded-2xl border transition-all ${
        isTop
          ? isDarkMode
            ? 'bg-gradient-to-br from-brand-purple/20 to-brand-teal/10 border-brand-purple/40'
            : 'bg-gradient-to-br from-brand-purple/5 to-brand-teal/5 border-brand-purple/30'
          : isDarkMode
          ? 'bg-antigravity-panel border-antigravity-border'
          : 'bg-white border-slate-200'
      }`}
      style={isTop && isDarkMode ? { boxShadow: '0 0 30px rgba(168,85,247,0.15)' } : {}}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <ScoreBadge score={opt.scorePercent} size={isTop ? 'md' : 'sm'} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {isTop && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-purple text-white rounded-full flex items-center gap-1">
                  <Trophy size={10} /> Recomendado
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDarkMode ? 'border-antigravity-border text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                #{opt.posicao} ranking
              </span>
            </div>
            <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{opt.nome}</h3>
            <p className={`text-[12px] mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{opt.descricao}</p>
          </div>
        </div>

        {/* Justificativa */}
        <div className={`mt-4 px-4 py-3 rounded-xl text-[12px] leading-relaxed ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          <span className="text-brand-purple font-medium">Por que esta opção? </span>
          {opt.justificativa}
        </div>

        {/* Cenários */}
        <div className="mt-4 space-y-2">
          <p className={`text-[10px] uppercase tracking-wider font-medium mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Simulação de cenários</p>
          <ScenarioRow label="Melhor caso" value={opt.cenarios.melhor} icon={TrendingUp} color="text-emerald-400" isDarkMode={isDarkMode} />
          <ScenarioRow label="Cenário esperado" value={opt.cenarios.esperado} icon={Minus} color="text-brand-teal" isDarkMode={isDarkMode} />
          <ScenarioRow label="Pior caso" value={opt.cenarios.pior} icon={TrendingDown} color="text-red-400" isDarkMode={isDarkMode} />
          <p className={`text-[10px] text-right ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Prazo de retorno: {opt.cenarios.prazo}</p>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 w-full flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
          {expanded ? <><ChevronUp size={13} /> Ocultar plano de ação</> : <><ChevronDown size={13} /> Ver plano de ação</>}
        </button>
      </div>

      {/* Action Plan (expandable) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 border-t ${isDarkMode ? 'border-antigravity-border' : 'border-slate-100'}`}>
              <p className={`text-[10px] uppercase tracking-wider font-medium mt-4 mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Plano de ação — 4 passos</p>
              <div className="space-y-2.5">
                {opt.acoes.map((acao, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] text-brand-purple font-bold">{idx + 1}</span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{acao}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Results Panel ──────────────────────────────────────────────────────
const ResultsPanel = ({ results, perfil, onReset, isDarkMode }) => {
  const top = results[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Análise concluída</span>
        </div>
        <h2 className={`text-xl font-display font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Sua melhor opção é:
        </h2>
        <p className={`text-2xl font-bold ${isDarkMode ? 'text-brand-purple' : 'text-brand-purple-dark'}`}>{top.nome}</p>
        <p className={`text-[12px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Score de compatibilidade: <span className="font-semibold text-brand-teal">{top.scorePercent}/100</span>
        </p>
      </motion.div>

      {/* Results cards */}
      <div className="space-y-4">
        {results.map((opt) => (
          <ResultCard key={opt.id} opt={opt} isDarkMode={isDarkMode} isTop={opt.recomendado} />
        ))}
      </div>

      {/* Reset button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all ${isDarkMode ? 'btn-ghost-dark' : 'btn-ghost-light'}`}
      >
        <RotateCcw size={15} />
        Fazer nova análise
      </motion.button>
    </motion.div>
  );
};

export default ResultsPanel;
