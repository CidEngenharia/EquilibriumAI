import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import IkigaiDiagram from '../components/IkigaiDiagram';

const Dashboard = () => {
  const [activeContext, setActiveContext] = useState('geral');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      {/* Premium Mesh Background */}
      <div className="bg-mesh"></div>

      <Sidebar activeContext={activeContext} onContextChange={setActiveContext} />
      
      <main className="ml-72 flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-600/5 to-transparent pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto p-10 relative z-10">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8 animate-in">
              <div className="relative flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-normal uppercase tracking-[0.2em] leading-none">
                  Assistente Online
                </span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Chat Area */}
              <div className="xl:col-span-8 animate-in" style={{ animationDelay: '0.1s' }}>
                <Chat context={activeContext} />
              </div>

              {/* Sidebar Info Area */}
              <div className="xl:col-span-4 space-y-10 animate-in" style={{ animationDelay: '0.2s' }}>
                {/* Knowledge Cards from Print */}
                <div className="space-y-6">
                    <KnowledgeCard 
                      title="KAIZEN" 
                      description="Pequenas melhorias diárias levam a resultados excepcionais." 
                      icon={<div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner">📈</div>}
                    />
                    <KnowledgeCard 
                      title="WABI-SABI" 
                      description="Encontre beleza na imperfeição e na impermanência." 
                      icon={<div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner">🍂</div>}
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-6">
                    <StatCard label="Decisões" value="12" growth="+2" />
                    <StatCard label="Equilíbrio" value="92%" growth="+5%" />
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

const KnowledgeCard = ({ title, description, icon }) => (
  <div className="bg-[#1E1F26] border border-white/5 rounded-[24px] p-6 hover:bg-white/[0.02] transition-all group cursor-pointer">
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-normal text-white uppercase tracking-widest mb-1 group-hover:text-violet-400 transition-colors">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-normal">{description}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, growth }) => (
  <div className="glass-card rounded-[28px] p-6 group">
    <p className="text-[10px] text-slate-500 font-normal uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-end gap-3">
      <h3 className="text-2xl font-normal text-white leading-none">{value}</h3>
      <span className="text-[10px] font-normal text-emerald-400 mb-0.5">{growth}</span>
    </div>
  </div>
);

export default Dashboard;
