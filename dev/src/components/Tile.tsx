import React from 'react';
import { TileData, CROPS, CreatureType } from '../types';
import Creature from './Creature';

interface TileProps {
  data: TileData;
  onPlant: (id: number) => void;
  onHarvest: (id: number) => void;
  onCollectCreature: (id: number, type: string) => void;
  onInfuse: (id: number, type: CreatureType) => void;
}

const Tile: React.FC<TileProps> = ({ data, onPlant, onHarvest, onCollectCreature, onInfuse }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent double clicking when clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (data.state === 'EMPTY') {
      onPlant(data.id);
    } else if (data.state === 'MATURE' || data.state === 'PLANTED') {
      // If an element is selected, we apply it. 
      // This logic will be handled by the parent handleTileClick or similar.
      // For now, we'll just pass the click up.
      if (data.state === 'MATURE') onHarvest(data.id);
      else onPlant(data.id); // This will handle application if something is selected
    }
  };

  const getSoilClass = () => {
    switch(data.soilType) {
      case 'WET': return 'bg-blue-900/40 border-blue-500/30';
      case 'DRY': return 'bg-yellow-900/30 border-yellow-500/20';
      case 'RICH': return 'bg-emerald-900/40 border-emerald-500/30';
      case 'ROCKY': return 'bg-slate-800 border-slate-600/50';
      default: return 'bg-slate-900/40 border-slate-800';
    }
  };

  const getElementOutline = () => {
    if (!data.appliedElements) return '';
    const { fire, sun, water } = data.appliedElements;
    let classes = '';
    if (fire > 0) classes += ` ring-red-500 ring-offset-2 ${fire > 1 ? 'ring-4' : 'ring-2'}`;
    else if (sun > 0) classes += ` ring-yellow-400 ring-offset-2 ${sun > 1 ? 'ring-4' : 'ring-2'}`;
    else if (water > 0) classes += ` ring-blue-500 ring-offset-2 ${water > 1 ? 'ring-4' : 'ring-2'}`;
    return classes;
  };

  const getSoilLabel = () => {
    switch(data.soilType) {
      case 'WET': return '湿润';
      case 'DRY': return '干燥';
      case 'RICH': return '肥沃';
      case 'ROCKY': return '贫瘠';
    }
  };

  return (
    <div 
      className={`relative w-32 h-32 rounded-[1.5rem] border-2 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-lg
        ${getSoilClass()}
        ${getElementOutline()}
        ${data.state === 'EMPTY' ? 'hover:scale-105 hover:border-white/20' : ''}
        ${data.state === 'TRANSFORMING' ? 'ring-4 ring-purple-500/50 animate-pulse' : ''}
      `}
      onClick={handleClick}
    >
      {/* Soil Label */}
      <div className="absolute top-2 left-3 text-[8px] font-black uppercase tracking-widest text-white/20">{getSoilLabel()}</div>

      {/* Crop Layer */}
      {data.state === 'PLANTED' && (
        <>
          <div className="text-3xl animate-bounce">🌱</div>
          <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000" 
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>
        </>
      )}

      {data.state === 'TRANSFORMING' && (
        <div className="flex flex-col items-center space-y-2 z-10">
          <div className="text-3xl animate-spin-slow">✨</div>
          <div className="flex space-x-1">
            <button onClick={() => onInfuse(data.id, 'SUN')} className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] hover:scale-110 shadow-lg">🟡</button>
            <button onClick={() => onInfuse(data.id, 'FIRE')} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-[10px] hover:scale-110 shadow-lg">🔴</button>
            <button onClick={() => onInfuse(data.id, 'WATER')} className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] hover:scale-110 shadow-lg">🔵</button>
          </div>
          <div className="text-[8px] font-black text-purple-300 uppercase animate-pulse">注入元素</div>
        </div>
      )}
      
      {data.state === 'MATURE' && data.cropType && (
        <div className="text-5xl drop-shadow-2xl filter brightness-110 hover:scale-110 transition-transform">{CROPS[data.cropType].icon}</div>
      )}

      {/* Creature Layer */}
      {data.hasCreature && data.creatureType && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Creature 
            key={`${data.id}-${data.lastSpawnedAt}`}
            type={data.creatureType} 
            onCollect={() => onCollectCreature(data.id, data.creatureType!)}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
