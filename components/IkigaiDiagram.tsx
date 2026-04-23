import React from 'react';
import { Category } from '../types';

interface IkigaiDiagramProps {
  activeCategory: Category | null;
  onCategoryClick: (cat: Category) => void;
}

export const IkigaiDiagram: React.FC<IkigaiDiagramProps> = ({ activeCategory, onCategoryClick }) => {
  const categories: { id: Category; label: string; color: string; cx: number; cy: number; emoji: string }[] = [
    { id: 'love', label: 'O que ama', color: 'rgba(239, 68, 68, 0.4)', cx: 200, cy: 150, emoji: '❤️' },
    { id: 'goodAt', label: 'O que é bom', color: 'rgba(59, 130, 246, 0.4)', cx: 130, cy: 220, emoji: '🧠' },
    { id: 'worldNeeds', label: 'O que precisa', color: 'rgba(34, 197, 94, 0.4)', cx: 270, cy: 220, emoji: '🌍' },
    { id: 'paidFor', label: 'O que gera renda', color: 'rgba(234, 179, 8, 0.4)', cx: 200, cy: 290, emoji: '💰' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square select-none">
      <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* Intersection Labels (Visible even on small screens) */}
        <text x="135" y="160" fontSize="8" className="fill-stone-400 font-normal uppercase tracking-tighter">Paixão</text>
        <text x="225" y="160" fontSize="8" className="fill-stone-400 font-normal uppercase tracking-tighter">Missão</text>
        <text x="135" y="315" fontSize="8" className="fill-stone-400 font-normal uppercase tracking-tighter">Profissão</text>
        <text x="225" y="315" fontSize="8" className="fill-stone-400 font-normal uppercase tracking-tighter">Vocação</text>
        
        {/* Main Circles */}
        {categories.map((cat) => (
          <g 
            key={cat.id} 
            onClick={() => onCategoryClick(cat.id)}
            className="cursor-pointer group"
          >
            <circle
              cx={cat.cx}
              cy={cat.cy}
              r="85"
              fill={cat.color}
              stroke={activeCategory === cat.id ? '#444' : 'transparent'}
              strokeWidth="1"
              className="ikigai-circle transition-all duration-300 group-hover:opacity-80"
            />
            <text 
              x={cat.cx} 
              y={cat.cy - 12} 
              textAnchor="middle" 
              fontSize="10" 
              className="fill-stone-800 font-normal pointer-events-none"
            >
              {cat.label}
            </text>
            <text 
              x={cat.cx} 
              y={cat.cy + 12} 
              textAnchor="middle" 
              fontSize="14" 
              className="pointer-events-none"
            >
              {cat.emoji}
            </text>
          </g>
        ))}

        {/* Center Label */}
        <g className="pointer-events-none">
          <circle cx="200" cy="220" r="30" fill="white" className="shadow-sm" />
          <text 
            x="200" 
            y="224" 
            textAnchor="middle" 
            fontSize="9" 
            className="fill-red-600 font-normal font-jp tracking-widest"
          >
            IKIGAI
          </text>
        </g>
      </svg>
      
      <div className="text-center mt-4 text-[10px] md:text-xs text-stone-400 font-normal uppercase tracking-widest animate-pulse">
        Toque nos círculos para preencher
      </div>
    </div>
  );
};