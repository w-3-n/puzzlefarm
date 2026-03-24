import React, { useMemo } from 'react';

interface CreatureProps {
  onCollect: (part: string) => void;
  type: string;
}

const Creature: React.FC<CreatureProps> = ({ onCollect, type }) => {
  // Randomly offset face slightly left or right (between -8 and 8 pixels)
  const faceOffset = useMemo(() => Math.floor(Math.random() * 17) - 8, []);

  return (
    <div className={`creature creature-${type.toLowerCase()}`}>
      <span 
        className="kaomoji-part left-ear" 
        onClick={(e) => { e.stopPropagation(); onCollect('ear'); }}
      >
        ʕ
      </span>
      <span 
        className="kaomoji-part face" 
        style={{ left: `calc(50% + ${faceOffset}px)` }}
        onClick={(e) => { e.stopPropagation(); onCollect('face'); }}
      >
        •ᴥ•
      </span>
      <span 
        className="kaomoji-part right-ear" 
        onClick={(e) => { e.stopPropagation(); onCollect('ear'); }}
      >
        ʔ
      </span>
    </div>
  );
};

export default Creature;
