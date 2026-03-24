import { useState, useEffect, useCallback } from 'react';
import { TileData, TileState, Inventory, CropType, CROPS } from './types';
import Tile from './components/Tile';
import './App.css';

const GRID_SIZE = 16;

function App() {
  const [tiles, setTiles] = useState<TileData[]>(() => 
    Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      state: 'EMPTY',
      progress: 0,
      hasCreature: false,
      creatureType: 'WATER',
    }))
  );

  const [selectedCrop, setSelectedCrop] = useState<CropType>('WHEAT');
  const [inventory, setInventory] = useState<Inventory>({
    water: 0, sun: 0, fire: 0,
    wheat: 0, carrot: 0, pumpkin: 0
  });

  // Spawn logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const spawn = () => {
      setTiles(currentTiles => {
        const numCreatures = currentTiles.filter(t => t.hasCreature).length;
        if (numCreatures < 3) {
          const emptyTiles = currentTiles.filter(t => !t.hasCreature);
          if (emptyTiles.length > 0) {
            const randomIdx = Math.floor(Math.random() * emptyTiles.length);
            const targetId = emptyTiles[randomIdx].id;
            const types: ('WATER' | 'SUN' | 'FIRE')[] = ['WATER', 'SUN', 'FIRE'];
            const randomType = types[Math.floor(Math.random() * types.length)];

            console.log(`SPAWNING: ${randomType} on ${targetId}`);
            const spawnTime = Date.now();
            
            return currentTiles.map(t => 
              t.id === targetId ? { 
                ...t, 
                hasCreature: true, 
                creatureType: randomType,
                lastSpawnedAt: spawnTime
              } : t
            );
          }
        }
        return currentTiles;
      });

      const nextTime = 2000 + Math.random() * 3000; // 2-5 seconds
      timeoutId = setTimeout(spawn, nextTime);
    };

    timeoutId = setTimeout(spawn, 1000); // Initial spawn
    return () => clearTimeout(timeoutId);
  }, []);

  // Crop growth logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTiles(prevTiles => 
        prevTiles.map(tile => {
          if (tile.state === 'PLANTED' && tile.cropType) {
            const crop = CROPS[tile.cropType];
            const growPerSec = 100 / crop.growTime;
            const newProgress = Math.min(100, tile.progress + growPerSec);
            return {
              ...tile,
              progress: newProgress,
              state: (newProgress >= 100 ? 'MATURE' : 'PLANTED') as TileState,
            };
          }
          return tile;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlant = (id: number) => {
    setTiles(prev => prev.map(t => t.id === id ? { 
      ...t, 
      state: 'PLANTED', 
      progress: 0, 
      cropType: selectedCrop 
    } : t));
  };

  const handleHarvest = (id: number) => {
    const tile = tiles.find(t => t.id === id);
    if (tile && tile.cropType) {
      const crop = tile.cropType;
      setInventory(prev => ({
        ...prev,
        [crop.toLowerCase()]: prev[crop.toLowerCase() as keyof Inventory] + 1
      }));
    }
    setTiles(prev => prev.map(t => t.id === id ? { ...t, state: 'EMPTY', progress: 0, cropType: undefined } : t));
  };

  const handleCollectCreature = useCallback((id: number, type: string) => {
    console.log(`COLLECTING: ${type} from ${id}`);
    setTiles(prev => prev.map(t => t.id === id ? { ...t, hasCreature: false } : t));
    setInventory(prev => ({
      ...prev,
      [type.toLowerCase()]: prev[type.toLowerCase() as keyof Inventory] + 1
    }));
  }, []);

  return (
    <div className="game-container">
      <header>
        <div className="menu-btn">[ ≡ ]</div>
        <h1>🧱 BrickFarm</h1>
        <div className="status-bar">
          <div className="snap-indicator">Snap: <span className="neon-on">ON ●</span></div>
          <div className="save-icon">💾</div>
        </div>
      </header>

      <div className="inventory-grid">
        <div className="inv-group">
          <span>💧 {inventory.water}</span>
          <span>☀️ {inventory.sun}</span>
          <span>🔥 {inventory.fire}</span>
        </div>
        <div className="inv-group">
          <span>🌾 {inventory.wheat}</span>
          <span>🥕 {inventory.carrot}</span>
          <span>🎃 {inventory.pumpkin}</span>
        </div>
      </div>

      <div className="crop-selector">
        {(Object.keys(CROPS) as CropType[]).map(type => (
          <button 
            key={type}
            className={`crop-btn ${selectedCrop === type ? 'active' : ''}`}
            onClick={() => setSelectedCrop(type)}
          >
            {CROPS[type].icon}
          </button>
        ))}
      </div>

      <div className="grid">
        {tiles.map(tile => (
          <Tile 
            key={tile.id} 
            data={tile} 
            onPlant={handlePlant} 
            onHarvest={handleHarvest} 
            onCollectCreature={handleCollectCreature}
          />
        ))}
      </div>

      <footer>
        <div className="controls">
          <button className="control-btn">{"<"}</button>
          <div className="layer-label">Layer: EARS</div>
          <button className="control-btn">{">"}</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
