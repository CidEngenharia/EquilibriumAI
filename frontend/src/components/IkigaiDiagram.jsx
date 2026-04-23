import React, { useState } from 'react';

const CATEGORIES = [
  { id: 'love',       label: 'O que você Ama',        color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  { id: 'goodAt',     label: 'No que você é Bom',     color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  { id: 'worldNeeds', label: 'O que o Mundo Precisa', color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  { id: 'paidFor',    label: 'Pelo que te Pagam',     color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
];

const INTERSECTIONS = [
  { label: 'Paixão',    top: '22%', left: '28%',  desc: 'Amo + Sou Bom' },
  { label: 'Missão',    top: '22%', right: '28%', desc: 'Amo + Mundo Precisa' },
  { label: 'Profissão', bottom: '22%', left: '28%', desc: 'Sou Bom + Me Pagam' },
  { label: 'Vocação',   bottom: '22%', right: '28%', desc: 'Mundo Precisa + Me Pagam' },
];

const IkigaiDiagram = ({ isDarkMode }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [items, setItems] = useState({ love: [], goodAt: [], worldNeeds: [], paidFor: [] });
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim() || !activeCategory) return;
    setItems(prev => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newItem.trim()],
    }));
    setNewItem('');
  };

  const removeItem = (cat, idx) => {
    setItems(prev => ({ ...prev, [cat]: prev[cat].filter((_, i) => i !== idx) }));
  };

  const category = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className={`font-display text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Mapa Ikigai
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Clique em cada círculo para adicionar seus elementos e descobrir seu propósito
        </p>
      </div>

      {/* Diagrama SVG */}
      <div className={`relative rounded-2xl p-8 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
        <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
          {/* Círculos */}
          {[
            { cx: 170, cy: 160, cat: 'love',       color: '#f87171' },
            { cx: 230, cy: 160, cat: 'goodAt',     color: '#60a5fa' },
            { cx: 170, cy: 240, cat: 'worldNeeds', color: '#34d399' },
            { cx: 230, cy: 240, cat: 'paidFor',    color: '#f59e0b' },
          ].map(({ cx, cy, cat, color }) => (
            <circle
              key={cat}
              cx={cx} cy={cy} r={80}
              fill={color}
              fillOpacity={activeCategory === cat ? 0.35 : 0.15}
              stroke={color}
              strokeWidth={activeCategory === cat ? 2 : 1}
              strokeOpacity={0.6}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            />
          ))}

          {/* Rótulos IKIGAI no centro */}
          <text x="200" y="196" textAnchor="middle" fontSize="11" fontWeight="600" fill={isDarkMode ? '#fff' : '#1e293b'} fontFamily="Inter">IKIGAI</text>
          <text x="200" y="210" textAnchor="middle" fontSize="8" fill={isDarkMode ? '#94a3b8' : '#64748b'} fontFamily="Inter">propósito</text>

          {/* Rótulos dos círculos */}
          {[
            { x: 142, y: 110, label: 'Amo', color: '#f87171' },
            { x: 258, y: 110, label: 'Sou Bom', color: '#60a5fa' },
            { x: 142, y: 295, label: 'Mundo Precisa', color: '#34d399' },
            { x: 258, y: 295, label: 'Me Pagam', color: '#f59e0b' },
          ].map(({ x, y, label, color }) => (
            <text key={label} x={x} y={y} textAnchor="middle" fontSize="9" fill={color} fontWeight="600" fontFamily="Inter">
              {label}
            </text>
          ))}
        </svg>

        {/* Intersecções */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {INTERSECTIONS.map(({ label, desc }) => (
            <div key={label} className={`rounded-xl p-3 text-center border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{label}</p>
              <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Painel de adição */}
      {activeCategory && category && (
        <div className={`rounded-2xl border p-6 animate-fade-in ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'}`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`} style={{ color: category.color }}>
            {category.label}
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Ex: Programar, Ensinar, Criar..."
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-teal/50'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-teal/50 focus:bg-white'
              }`}
            />
            <button
              onClick={addItem}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: category.color }}
            >
              Adicionar
            </button>
          </div>

          {/* Lista de itens */}
          {items[activeCategory].length > 0 && (
            <div className="flex flex-wrap gap-2">
              {items[activeCategory].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: category.color + 'cc' }}
                >
                  {item}
                  <button onClick={() => removeItem(activeCategory, i)} className="opacity-70 hover:opacity-100 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IkigaiDiagram;
