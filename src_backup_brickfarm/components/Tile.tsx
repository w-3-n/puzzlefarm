import React from 'react';
import { TileData, CROPS } from '../types';
import Creature from './Creature';

interface TileProps {
  data: TileData;
  onPlant: (id: number) => void;
  onHarvest: (id: number) => void;
  onCollectCreature: (id: number, type: string) => void;
}

const Tile: React.FC<TileProps> = ({ data, onPlant, onHarvest, onCollectCreature }) => {
  const handleClick = () => {
    if (data.state === 'EMPTY') {
      onPlant(data.id);
    } else if (data.state === 'MATURE') {
      onHarvest(data.id);
    }
  };

  return (
    <div 
      className={`tile tile-${data.state.toLowerCase()} ${data.hasCreature ? 'has-creature' : ''}`}
      onClick={handleClick}
    >
      {/* Base "Brick" Layer */}
      <div className="brick-layer"></div>

      {/* Crop Layer */}
      {data.state === 'PLANTED' && (
        <div className="crop-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
      )}
      {data.state === 'MATURE' && data.cropType && (
        <div className="mature-crop">{CROPS[data.cropType].icon}</div>
      )}

      {/* Creature Layer */}
      {data.hasCreature && (
        <div className="creature-layer">
          <Creature 
            key={`${data.id}-${data.lastSpawnedAt}`}
            type={data.creatureType} 
            onCollect={() => onCollectCreature(data.id, data.creatureType)}
          />
        </div>
      )}

      {/* Mockup UI Elements */}
      <div className="snap-point left-snap"></div>
      <div className="snap-point right-snap"></div>
    </div>
  );
};

export default Tile;
