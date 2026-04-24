import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Trash2, RotateCcw, Inbox } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext.jsx';

const HistoryPage = ({ isDarkMode }) => {
  const { history, removeDecision, navigate } = useApp();

  const objetivoLabel = {
    financeiro: 'Ganhar dinheiro',
    negocio: 'Escalar negócio',
    profissao: 'Mudar de carreira',
    proposito: 'Encontrar propósito',
  };

  if (history.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-antigravity-surface' : 'bg-slate-100'}`}>
          <Inbox size={28} className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />
        </div>
        <div>
          <p className={`text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Nenhuma decisão ainda</p>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Suas análises aparecerão aqui após a primeira decisão.</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(SCREENS.DECISION)}
          className="btn-primary flex items-center gap-2 mt-2">
          <RotateCcw size={15} /> Fazer minha primeira análise
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {history.length} {history.length === 1 ? 'decisão' : 'decisões'} salvas
        </h2>
      </div>
      <AnimatePresence>
        {history.map((item, idx) => {
          const top = item.resultados?.[0];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded-2xl border p-5 transition-all ${isDarkMode ? 'bg-antigravity-panel border-antigravity-border' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={14} className="text-decision-gold shrink-0" />
                    <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {top?.nome || 'Decisão'}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-brand-purple/20 text-brand-purple' : 'bg-brand-purple/10 text-brand-purple-dark'}`}>
                      {top?.scorePercent}/100
                    </span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Objetivo: {objetivoLabel[item.perfil?.objetivo] || item.perfil?.objetivo}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={11} className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />
                    <p className={`text-[10px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{item.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeDecision(item.id)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-600 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Mini ranking dos top 3 */}
              {item.resultados && (
                <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-antigravity-border' : 'border-slate-100'}`}>
                  <p className={`text-[9px] uppercase tracking-wider font-medium mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Top 3 desta análise</p>
                  <div className="space-y-1.5">
                    {item.resultados.map((r) => (
                      <div key={r.id} className="flex items-center gap-2">
                        <span className={`text-[10px] w-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>#{r.posicao}</span>
                        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-antigravity-border' : 'bg-slate-100'}`}>
                          <div className="h-full rounded-full" style={{ width: `${r.scorePercent}%`, background: 'linear-gradient(90deg, #8ec6c5, #a855f7)' }} />
                        </div>
                        <span className={`text-[10px] truncate max-w-[100px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{r.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoryPage;
