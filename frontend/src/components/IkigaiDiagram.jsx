import React from 'react';

const IkigaiDiagram = () => {
  return (
    <div className="glass-card rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-pink-500/10 blur-[60px] group-hover:bg-pink-500/20 transition-colors"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-lg font-normal text-white tracking-tight">Ikigai Framework</h3>
          <p className="text-[10px] text-slate-400 font-normal uppercase tracking-widest mt-1">Convergência de Propósito</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-help">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      
      <div className="relative w-full aspect-square flex items-center justify-center scale-90 sm:scale-100">
        {/* Simplified conceptual diagram with sophisticated styling */}
        <Circle label="Paixão" color="bg-pink-500" pos="-translate-y-10" />
        <Circle label="Profissão" color="bg-violet-500" pos="translate-x-10 translate-y-4" />
        <Circle label="Missão" color="bg-emerald-500" pos="-translate-x-10 translate-y-4" />
        
        {/* Core center */}
        <div className="z-20 w-24 h-24 rounded-full glass border border-white/20 flex flex-col items-center justify-center shadow-2xl">
            <span className="text-[10px] font-normal text-violet-400 uppercase tracking-tighter leading-none">Viver</span>
            <span className="text-lg font-normal text-white italic">Ikigai</span>
        </div>
      </div>

      <div className="mt-10 space-y-3 relative z-10">
        <WisdomCard title="Kaizen" text="Pequenas melhorias diárias levam a resultados excepcionais." icon="📈" />
        <WisdomCard title="Wabi-sabi" text="Encontre beleza na imperfeição e na impermanência." icon="🍂" />
      </div>
    </div>
  );
};

const Circle = ({ label, color, pos }) => (
  <div className={`absolute w-36 h-36 rounded-full ${color}/10 border-2 border-${color.split('-')[1]}-500/20 backdrop-blur-[2px] flex items-center justify-center ${pos} transition-all duration-500 hover:scale-105 hover:bg-${color.split('-')[1]}-500/20`}>
    <span className={`text-[9px] font-normal uppercase tracking-widest text-${color.split('-')[1]}-400`}>{label}</span>
  </div>
);

const WisdomCard = ({ title, text, icon }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/card">
    <div className="text-xl flex-shrink-0 group-hover/card:scale-125 transition-transform">{icon}</div>
    <div>
      <h5 className="text-xs font-normal text-white uppercase tracking-wider">{title}</h5>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default IkigaiDiagram;
