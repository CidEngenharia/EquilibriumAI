import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, CheckSquare, Square, FileText, FileSpreadsheet, Briefcase, Code } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ENGINES = [
  { id: 'google', label: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'drive', label: 'Google Drive', url: 'https://www.google.com/search?q=', prefix: 'site:drive.google.com ' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/search?q=' },
  { id: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'duck', label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'reddit', label: 'Reddit', url: 'https://www.reddit.com/search/?q=' },
];

const SuperSearch = () => {
  const { isDarkMode } = useApp();
  const [term, setTerm] = useState('');
  const [fileType, setFileType] = useState('');
  const [selectedEngines, setSelectedEngines] = useState({
    google: true,
    drive: true,
    github: true,
    bing: false,
    duck: false,
    reddit: false,
  });

  const toggleEngine = (id) => {
    setSelectedEngines((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearInput = () => {
    setTerm('');
  };

  const getFileTypeQuery = () => {
    return fileType ? ` filetype:${fileType}` : '';
  };

  const executeSearch = (enginesToUse) => {
    if (!term.trim()) {
      alert('Por favor, digite algo para buscar.');
      return;
    }

    const baseQuery = term.trim() + getFileTypeQuery();

    let delay = 0;
    ENGINES.forEach((engine) => {
      if (enginesToUse[engine.id]) {
        setTimeout(() => {
          let finalQuery = baseQuery;
          if (engine.prefix) finalQuery = engine.prefix + finalQuery;
          const url = engine.url + encodeURIComponent(finalQuery);
          window.open(url, '_blank');
        }, delay);
        delay += 200; // Atraso para evitar bloqueio de popup
      }
    });
  };

  const handleSearch = () => {
    executeSearch(selectedEngines);
  };

  const handleDeepSearch = () => {
    const allEngines = ENGINES.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});
    executeSearch(allEngines);
  };

  const executePreset = (query, engineUrl) => {
    window.open(engineUrl + encodeURIComponent(query), '_blank');
  };

  const presets = [
    {
      label: 'PDFs no Drive',
      icon: FileText,
      action: () => {
        const query = `site:drive.google.com filetype:pdf "${term || 'relatório OR manual'}"`;
        executePreset(query, 'https://www.google.com/search?q=');
      }
    },
    {
      label: 'Planilhas',
      icon: FileSpreadsheet,
      action: () => {
        const query = `(filetype:xls OR filetype:xlsx OR filetype:csv) "${term || 'planilha'}"`;
        executePreset(query, 'https://www.google.com/search?q=');
      }
    },
    {
      label: 'Currículos',
      icon: Briefcase,
      action: () => {
        const query = `(intitle:curriculo OR intitle:resume) (filetype:pdf OR filetype:doc OR filetype:docx) "${term || 'desenvolvedor'}"`;
        executePreset(query, 'https://www.google.com/search?q=');
      }
    },
    {
      label: 'Códigos GitHub',
      icon: Code,
      action: () => {
        const query = `${term || 'authentication'} filename:.env OR filename:config stars:>50`;
        window.open(`https://github.com/search?q=${encodeURIComponent(query)}&type=code`, '_blank');
      }
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className={`text-3xl font-display font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          🚀 Busca Turbo
        </h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Buscas avançadas com motores inteligentes aprimorados.
        </p>
      </div>

      {/* Main Search Area */}
      <div className={`rounded-xl border p-6 md:p-8 space-y-6 ${isDarkMode ? 'bg-antigravity-panel/50 border-antigravity-border backdrop-blur-md' : 'bg-white border-slate-200 shadow-card-light'}`}>
        
        {/* Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} size={20} />
          </div>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Digite o que deseja encontrar..."
            className={`w-full pl-12 pr-12 py-4 rounded-xl border text-lg outline-none transition-all ${
              isDarkMode 
                ? 'bg-black/20 border-white/10 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
            }`}
          />
          {term && (
            <button
              onClick={clearInput}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Engines Checkboxes */}
          <div className="flex-1 space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Onde você deseja buscar?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ENGINES.map((engine) => {
                const isSelected = selectedEngines[engine.id];
                return (
                  <button
                    key={engine.id}
                    onClick={() => toggleEngine(engine.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? (isDarkMode ? 'bg-brand-purple/20 border-brand-purple/40 text-white' : 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple-dark')
                        : (isDarkMode ? 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100')
                    }`}
                  >
                    {isSelected ? <CheckSquare size={18} className="text-brand-purple" /> : <Square size={18} />}
                    <span className="text-sm font-medium">{engine.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="md:w-64 space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Tipo de Arquivo
            </p>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none appearance-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-black/20 border-white/10 text-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <option value="">Qualquer arquivo</option>
              <option value="pdf">PDF (.pdf)</option>
              <option value="docx">Word (.docx)</option>
              <option value="xlsx">Excel (.xlsx)</option>
            </select>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleSearch}
                className="w-full py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-medium transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Buscar
              </button>
              <button
                onClick={handleDeepSearch}
                className="w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-yellow-400 font-bold transition-all flex items-center justify-center gap-2"
              >
                Varredura Pesada
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="text-decision-gold">⚡</span> Atalhos Inteligentes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={preset.action}
                className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all ${
                  isDarkMode 
                    ? 'bg-antigravity-panel/30 border-antigravity-border hover:border-brand-purple/30 hover:bg-brand-purple/5' 
                    : 'bg-white border-slate-200 hover:border-brand-purple/30 hover:bg-brand-purple/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <Icon size={16} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {preset.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SuperSearch;
