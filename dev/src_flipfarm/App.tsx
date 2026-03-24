
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { type PlantType, PLANTS, type TileState, type GameResources } from './types';
import confetti from 'canvas-confetti';

const ROWS = 4;
const COLS = 5;
const GRID_SIZE = ROWS * COLS;
const MAX_RESOURCE = 100;

function App() {
  const [tiles, setTiles] = useState<TileState[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      x: i % COLS,
      y: Math.floor(i / COLS),
      plantType: null,
      growth: 0,
      isLocked: false,
    }))
  );

  const [resources, setResources] = useState<GameResources>({
    water: 80,
    sunlight: 80,
    fertilizer: 50,
  });

  const [selectedPlant, setSelectedPlant] = useState<PlantType>('lavender');
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Adjacency Bonuses Logic
  const adjacencyBonuses = useMemo(() => {
    let regenMultiplier = 1;
    let waterReduction = 0;

    tiles.forEach(tile => {
      if (!tile.plantType) return;
      
      const neighbors = getNeighbors(tile.id, tiles);
      neighbors.forEach(n => {
        if (!n.plantType) return;
        
        if (
          (tile.plantType === 'lavender' && n.plantType === 'wild-honey') ||
          (tile.plantType === 'wild-honey' && n.plantType === 'lavender')
        ) {
          regenMultiplier += 0.1; 
        }

        if (tile.plantType === 'fern' && n.plantType === 'sunflower') {
          waterReduction = 0.3;
        }
      });
    });

    return { regenMultiplier, waterReduction };
  }, [tiles]);

  // Resource regeneration (Faster for better gameplay)
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => ({
        water: Math.min(MAX_RESOURCE, prev.water + 1.5 * adjacencyBonuses.regenMultiplier),
        sunlight: Math.min(MAX_RESOURCE, prev.sunlight + 1.5 * adjacencyBonuses.regenMultiplier),
        fertilizer: Math.min(MAX_RESOURCE, prev.fertilizer + 0.8 * adjacencyBonuses.regenMultiplier),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [adjacencyBonuses]);

  // Passive Time-Based Growth
  useEffect(() => {
    const interval = setInterval(() => {
      setTiles(prev => prev.map(t => {
        if (t.plantType && !t.isLocked) {
          const newGrowth = Math.min(100, t.growth + 1); // 1% passive growth per second
          return { ...t, growth: newGrowth, isLocked: newGrowth === 100 };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (id: number) => {
    const tile = tiles[id];
    if (tile.isLocked) return;

    const plant = tile.plantType ? PLANTS[tile.plantType] : PLANTS[selectedPlant];
    const waterReq = plant.waterReq * (tile.plantType === 'fern' ? (1 - adjacencyBonuses.waterReduction) : 1);

    if (
      resources.water >= waterReq &&
      resources.sunlight >= plant.sunReq &&
      resources.fertilizer >= plant.fertReq
    ) {
      // Subtract resources
      setResources(prev => ({
        water: prev.water - waterReq,
        sunlight: prev.sunlight - plant.sunReq,
        fertilizer: prev.fertilizer - plant.fertReq,
      }));

      if (tile.plantType === null) {
        // Planting
        setTiles(prev => prev.map(t => 
          t.id === id ? { ...t, plantType: selectedPlant, growth: 15 } : t
        ));
      } else {
        // Nurturing (Big growth boost)
        setTiles(prev => prev.map(t => {
          if (t.id === id) {
            const newGrowth = Math.min(100, t.growth + 30);
            return { ...t, growth: newGrowth, isLocked: newGrowth === 100 };
          }
          return t;
        }));
      }
    }
  };

  useEffect(() => {
    if (tiles.every(t => t.isLocked) && !isGameFinished) {
      setIsGameFinished(true);
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#9B59B6', '#F1C40F', '#27AE60', '#D35400']
        });
      }, 1500);
    }
  }, [tiles, isGameFinished]);

  return (
    <div className={`game-container ${isGameFinished ? 'finished' : ''}`}>
      <div className="final-canvas"></div>
      
      {!isGameFinished && (
        <aside className="sidebar">
          <div>
            <h1 className="title">Botanical</h1>
            <h2 className="subtitle">Mosaic Masterpiece</h2>
          </div>

          <div className="resources">
            <ResourceItem label="Water" value={resources.water} type="water" />
            <ResourceItem label="Sunlight" value={resources.sunlight} type="sunlight" />
            <ResourceItem label="Fertilizer" value={resources.fertilizer} type="fertilizer" />
          </div>

          <div className="seed-picker">
            <p style={{fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em'}}>SELECT SPECIES</p>
            {(Object.keys(PLANTS) as PlantType[]).map(type => (
              <div 
                key={type}
                className={`seed-card ${selectedPlant === type ? 'active' : ''}`}
                onClick={() => setSelectedPlant(type)}
              >
                <span style={{ fontSize: '1.5rem' }}>{PLANTS[type].icon}</span>
                <div className="seed-info">
                  <span className="seed-name">{PLANTS[type].name}</span>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    W:{PLANTS[type].waterReq} S:{PLANTS[type].sunReq} F:{PLANTS[type].fertReq}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="status-panel">
            {adjacencyBonuses.regenMultiplier > 1 && <p>✨ Regen: {(adjacencyBonuses.regenMultiplier * 100).toFixed(0)}%</p>}
            {adjacencyBonuses.waterReduction > 0 && <p>🌿 Water Efficiency active</p>}
          </div>
        </aside>
      )}

      <main className="main-view">
        <div className="grid-container">
          {tiles.map(tile => (
            <Tile 
              key={tile.id} 
              state={tile} 
              neighbors={getNeighbors(tile.id, tiles)}
              onClick={() => handleTileClick(tile.id)} 
              canAfford={resources.water >= (tile.plantType ? PLANTS[tile.plantType].waterReq : PLANTS[selectedPlant].waterReq)}
            />
          ))}
        </div>
      </main>

      <div className="masterpiece-modal">
        <h1 className="title">Masterpiece Complete</h1>
        <p className="subtitle">Your botanical tapestry is preserved.</p>
        <button 
          className="masterpiece-button" 
          onClick={() => window.location.reload()}
        >
          RESTART JOURNEY
        </button>
      </div>
    </div>
  );
}

function getNeighbors(id: number, tiles: TileState[]) {
  const tile = tiles[id];
  return tiles.filter(t => 
    (Math.abs(t.x - tile.x) === 1 && t.y === tile.y) ||
    (Math.abs(t.y - tile.y) === 1 && t.x === tile.x)
  );
}

function ResourceItem({ label, value, type }: { label: string, value: number, type: string }) {
  return (
    <div className="resource-item">
      <span>{label}</span>
      <div className="resource-bar">
        <div className={`resource-fill ${type}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function Tile({ state, neighbors, onClick, canAfford }: { state: TileState, neighbors: TileState[], onClick: () => void, canAfford: boolean }) {
  const plant = state.plantType ? PLANTS[state.plantType] : null;
  
  const seams = neighbors.map(n => {
    if (!state.plantType || !n.plantType || state.plantType === n.plantType) return '';
    if (n.y < state.y) return 'seam-north';
    if (n.y > state.y) return 'seam-south';
    if (n.x > state.x) return 'seam-east';
    if (n.x < state.x) return 'seam-west';
    return '';
  }).join(' ');

  return (
    <div 
      className={`tile ${state.isLocked ? 'locked' : ''} ${seams} ${!canAfford && !state.isLocked ? 'low-res' : ''}`}
      onClick={onClick}
    >
      {state.plantType && (
        <div 
          className={`texture-fragment ${PLANTS[state.plantType].pattern} ${!state.isLocked ? 'fragment-growing' : ''}`}
          style={{ 
            backgroundPosition: `${-state.x * 120}px ${-state.y * 120}px` 
          }}
        />
      )}

      {state.plantType && !state.isLocked && (
        <>
          <div className="tile-seedling">
            {state.growth < 40 ? '🌱' : plant?.icon}
          </div>
          <div className="tile-progress-bar">
            <div className="tile-progress-fill" style={{ width: `${state.growth}%` }}></div>
          </div>
        </>
      )}

      {!state.plantType && (
        <div className="tile-add-icon">
          <span>+</span>
          <div style={{fontSize: '0.6rem', marginTop: '4px'}}>PLANT</div>
        </div>
      )}
    </div>
  );
}

export default App;
