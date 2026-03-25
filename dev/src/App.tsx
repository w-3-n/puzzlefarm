import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { 
  type PlantType, 
  PLANTS, 
  type LegacyTileState, 
  type GameResources, 
  type ElementInventory, 
  type CreatureType,
  type WeatherType,
  type TileData,
  type Blueprint,
  type SoilType,
  type TileState,
  type DiceState
} from './types';
import { BLUEPRINTS, UPGRADE_RULES } from './data';
import Tile from './components/Tile';
import confetti from 'canvas-confetti';

const ROWS = 4;
const COLS = 4;
const GRID_SIZE = ROWS * COLS;
const MAX_RESOURCE = 100;

const PACKS = [
  { id: 'outer', name: '外门弟子布袋', cost: 30, limit: 5 },
  { id: 'inner', name: '内门弟子木箱', cost: 100, limit: 3 },
  { id: 'booster', name: '地形补充包', cost: 150, limit: 2 },
  { id: 'elder', name: '核心长老私藏', cost: 400, limit: 1 }
];

const App: React.FC = () => {
  // Game States
  const [tiles, setTiles] = useState<LegacyTileState[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => {
      const x = i % COLS;
      const y = Math.floor(i / COLS);
      let soilType: SoilType = 'RICH';
      
      if (x < 2 && y < 2) soilType = 'WET';
      else if (x >= 2 && y < 2) soilType = 'DRY';
      else if (x < 2 && y >= 2) soilType = 'RICH';
      else if (x >= 2 && y >= 2) soilType = 'ROCKY';

      return {
        id: i,
        x,
        y,
        soilType,
        plantType: null,
        growth: 0,
        isLocked: false,
        hasCreature: false,
      };
    })
  );

  const [resources, setResources] = useState<GameResources>({
    water: 50,
    sunlight: 50,
    fertilizer: 50, // This will be used for FIRE/FERT
  });

  const [elementInventory, setElementInventory] = useState<ElementInventory>({
    water: 1,
    sun: 1,
    fire: 1,
  });

  const [fp, setFp] = useState(500);
  const [kp, setKp] = useState(0);
  const [weather, setWeather] = useState<WeatherType>('SUNNY');
  const [selectedPlant, setSelectedPlant] = useState<PlantType>('baishizhen-seed-0');
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'FARM' | 'LAB' | 'QUOTA'>('LAB');
  const [inventory, setInventory] = useState<Partial<Record<PlantType, number>>>({
    'baishizhen-seed-0': 5
  });
  const [completedBlueprints, setCompletedBlueprints] = useState<string[]>([]);
  const [diceState, setDiceState] = useState<DiceState>({
    isVisible: false,
    value: null,
    targetTileId: null,
    baseChance: 0,
    upgradeTarget: 'baishizhen-seed-1',
    isRolling: false
  });
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);

  // Discovery system
  const [discoveredCrops, setDiscoveredCrops] = useState<PlantType[]>(['baishizhen-seed-0']);
  
  const unlockedCrops = useMemo(() => {
    // Return discovered crops and anything currently in inventory
    const inInv = Object.keys(inventory).filter(k => (inventory[k as PlantType] || 0) > 0) as PlantType[];
    const all = Array.from(new Set([...discoveredCrops, ...inInv]));
    return all;
  }, [discoveredCrops, inventory]);

  // Resource regeneration: Depends on WEATHER
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => {
        let wIncr = 0.2;
        let sIncr = 0.2;
        let fIncr = 0.1;

        if (weather === 'RAINY') { wIncr += 2.0; sIncr -= 0.5; }
        if (weather === 'STORMY') { wIncr += 3.5; sIncr -= 1.0; }
        if (weather === 'SUNNY') { sIncr += 2.0; wIncr -= 0.5; }
        if (weather === 'WINDY') { fIncr += 1.5; }

        return {
          water: Math.max(0, Math.min(MAX_RESOURCE, prev.water + wIncr)),
          sunlight: Math.max(0, Math.min(MAX_RESOURCE, prev.sunlight + sIncr)),
          fertilizer: Math.max(0, Math.min(MAX_RESOURCE, prev.fertilizer + fIncr)),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [weather]);

  // Passive Time-Based Growth
  useEffect(() => {
    const interval = setInterval(() => {
      setTiles(prev => prev.map(t => {
        if (t.plantType && !t.isLocked) {
          // Accelerated growth: 50% per second
          let growthIncr = 50; 

          const newGrowth = Math.min(100, t.growth + growthIncr);
          return { ...t, growth: newGrowth, isLocked: newGrowth === 100 };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [weather]);

  // Creature Spawning logic
  useEffect(() => {
    let timeoutId: any;
    const spawn = () => {
      setTiles(currentTiles => {
        const numCreatures = currentTiles.filter(t => t.hasCreature).length;
        if (numCreatures < 3) {
          const emptyTiles = currentTiles.filter(t => !t.hasCreature);
          if (emptyTiles.length > 0) {
            const randomIdx = Math.floor(Math.random() * emptyTiles.length);
            const targetId = emptyTiles[randomIdx].id;
            const types: CreatureType[] = ['WATER', 'SUN', 'FIRE'];
            const randomType = types[Math.floor(Math.random() * types.length)];
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
      const nextTime = 2000 + Math.random() * 3000;
      timeoutId = setTimeout(spawn, nextTime);
    };
    timeoutId = setTimeout(spawn, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handlePlant = (id: number) => {
    const tile = tiles.find(t => t.id === id);
    if (!tile) return;

    // Check if we have the seed
    if ((inventory[selectedPlant] || 0) <= 0) {
      alert(`你没有足够的【${PLANTS[selectedPlant].name}】。`);
      return;
    }

    // Resource consumption based on PLANTS data
    const plantReq = PLANTS[selectedPlant];
    if (resources.water < plantReq.waterReq || 
        resources.sunlight < plantReq.sunReq || 
        resources.fertilizer < plantReq.fertReq) {
      alert(`资源不足以种植【${plantReq.name}】。需要：💧${plantReq.waterReq}, ☀️${plantReq.sunReq}, 🔥${plantReq.fertReq}`);
      return;
    }

    let finalPlant = selectedPlant;
    
    // Convert seed to plant
    if (selectedPlant.endsWith('-seed-0')) finalPlant = selectedPlant.replace('-seed-0', '-0') as PlantType;
    else if (selectedPlant.endsWith('-seed-1')) finalPlant = selectedPlant.replace('-seed-1', '-1') as PlantType;
    else if (selectedPlant.endsWith('-seed-2')) finalPlant = selectedPlant.replace('-seed-2', '-2') as PlantType;
    else if (selectedPlant.endsWith('-seed-3')) finalPlant = selectedPlant.replace('-seed-3', '-3') as PlantType;
    else if (selectedPlant === 'chiyan-rice-seed') finalPlant = 'chiyan-rice';
    else if (selectedPlant === 'jiahe-rice-seed') finalPlant = 'jiahe-rice';

    // Deduct seed and resources
    setInventory(inv => ({
      ...inv,
      [selectedPlant]: (inv[selectedPlant] || 1) - 1
    }));

    setResources(prev => ({
      water: prev.water - plantReq.waterReq,
      sunlight: prev.sunlight - plantReq.sunReq,
      fertilizer: prev.fertilizer - plantReq.fertReq,
    }));

    setTiles(prev => prev.map(t => 
      t.id === id ? { ...t, plantType: finalPlant, growth: 0, isLocked: false } : t
    ));
  };

  const handleHarvest = (id: number) => {
    const tile = tiles.find(t => t.id === id);
    if (tile && tile.plantType) {
      const plantType = tile.plantType;

      // Check for upgrade rules

      const rule = UPGRADE_RULES.find(r => 
        r.source === plantType && 
        (!r.landCondition || r.landCondition === tile.soilType)
      );

      if (rule && rule.hasDice) {
        // Trigger dice roll
        setDiceState({
          isVisible: true,
          value: null,
          targetTileId: id,
          baseChance: rule.baseChance,
          upgradeTarget: rule.target,
          isRolling: false
        });
        return;
      }

      // No dice rule, check for 100% upgrade (like special rice)
      if (rule && !rule.hasDice) {
         // Some rules might have additional conditions like element count or adjacency
         // For now, if it matches source and land, and has no dice, we check other conditions
         let conditionMet = true;
         if (rule.otherCondition === 'ADJACENT_BAISHIZHEN') {
            const neighbors = tiles.filter(t => 
              Math.abs(t.x - tile.x) + Math.abs(t.y - tile.y) === 1
            );
            conditionMet = neighbors.some(n => n.plantType?.startsWith('baishizhen'));
         }
         
         if (conditionMet) {
            finalizeHarvest(id, rule.target);
            return;
         }
      }

      // Default 100% harvest: product + same-level seed
      finalizeHarvest(id);
    }
  };

  const finalizeHarvest = (tileId: number, upgradeSeed?: PlantType) => {
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || !tile.plantType) return;

    const plantType = tile.plantType;
    const plant = PLANTS[plantType];

    // 100% Harvest: Product
    setInventory(inv => ({ ...inv, [plantType]: (inv[plantType] || 0) + 1 }));

    if (upgradeSeed) {
      // Success! Got the upgraded seed
      setInventory(inv => ({ ...inv, [upgradeSeed]: (inv[upgradeSeed] || 0) + 1 }));
      setDiscoveredCrops(prev => Array.from(new Set([...prev, upgradeSeed])));
      alert(`奇迹发生了！你获得了【${PLANTS[upgradeSeed].name}】。`);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      // Normal: Get the same-level seed back
      const seedType = plantType.includes('-') 
        ? plantType.replace(/-(0|1|2|3)$/, '-seed-$1') as PlantType
        : `${plantType}-seed` as PlantType;
      
      if (PLANTS[seedType]) {
        setInventory(inv => ({ ...inv, [seedType]: (inv[seedType] || 0) + 1 }));
      }
      alert(`收获了【${plant.name}】。`);
    }

    setDiscoveredCrops(prev => Array.from(new Set([...prev, plantType])));
    setFp(f => f + plant.basePrice);
    setTiles(prev => prev.map(t => 
      t.id === tileId ? { ...t, plantType: null, growth: 0, isLocked: false } : t
    ));
  };

  const rollDice = () => {
    if (diceState.isRolling) return;
    setDiceState(prev => ({ ...prev, isRolling: true }));
    
    // Simulate rolling
    setTimeout(() => {
      const rollValue = Math.floor(Math.random() * 6) + 1;
      const totalChance = diceState.baseChance + (rollValue * 0.1);
      const isSuccess = Math.random() < totalChance;

      setDiceState(prev => ({ ...prev, value: rollValue, isRolling: false }));

      setTimeout(() => {
        setDiceState(prev => ({ ...prev, isVisible: false }));
        if (diceState.targetTileId !== null) {
          finalizeHarvest(diceState.targetTileId, isSuccess ? diceState.upgradeTarget : undefined);
        }
      }, 1500);
    }, 1000);
  };

  const handleCollectCreature = useCallback((id: number, type: string) => {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, hasCreature: false } : t));

    // Increase the resource bar when collecting a creature
    setResources(prev => {
      let next = { ...prev };
      if (type === 'WATER') next.water = Math.min(MAX_RESOURCE, next.water + 25);
      if (type === 'SUN') next.sunlight = Math.min(MAX_RESOURCE, next.sunlight + 25);
      if (type === 'FIRE') next.fertilizer = Math.min(MAX_RESOURCE, next.fertilizer + 25);
      return next;
    });

    // Still give essence for infusion
    setElementInventory(prev => ({
      ...prev,
      [type.toLowerCase()]: prev[type.toLowerCase() as keyof ElementInventory] + 1
    }));

    let kpGain = 10;
    if (tiles.some(t => t.plantType === 'spirit-millet')) kpGain *= 1.1;
    if (tiles.some(t => t.plantType === 'feiling')) kpGain *= 1.15;
    if (tiles.some(t => t.plantType === 'hongguo')) kpGain *= 1.2;

    setKp(k => k + Math.floor(kpGain));
    setFp(f => f + 10);
  }, [tiles]);


  const handleCompleteBlueprint = (blueprint: Blueprint) => {
    // Check if player has all required crops
    const hasAll = blueprint.requiredCrops.every(crop => (inventory[crop] || 0) > 0);
    
    if (hasAll) {
      setInventory(prev => {
        const next = { ...prev };
        blueprint.requiredCrops.forEach(crop => {
          next[crop] = (next[crop] || 1) - 1;
        });
        return next;
      });
      setKp(prev => prev + blueprint.rewardKP);
      setCompletedBlueprints(prev => [...prev, blueprint.id]);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`成功完成拼图: ${blueprint.name}！获得了 ${blueprint.rewardKP} 知识点。`);
    } else {
      alert("还没凑齐拼图所需的作物呢，去 Mirror Earth 收集吧！");
    }
  };

  useEffect(() => {
    if (tiles.length > 0 && tiles.every(t => t.growth === 100 && t.plantType) && !isGameFinished) {
      setIsGameFinished(true);
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#9B59B6', '#F1C40F', '#27AE60', '#D35400']
        });
      }, 500);
    }
  }, [tiles, isGameFinished]);

  const handleInfuseElement = (id: number, elementType: CreatureType) => {
    const invKey = elementType.toLowerCase() as keyof ElementInventory;
    if (elementInventory[invKey] > 0) {
      setElementInventory(prev => ({ ...prev, [invKey]: prev[invKey] - 1 }));
      
      let nextPlant: PlantType = 'white-jade-rice-0';
      if (elementType === 'SUN') nextPlant = 'white-jade-rice-0'; 
      if (elementType === 'FIRE') nextPlant = 'white-jade-rice-1'; 
      if (elementType === 'WATER') nextPlant = 'white-jade-rice-2'; 

      setTiles(prev => prev.map(t =>
        t.id === id ? { ...t, plantType: nextPlant, growth: 0, isLocked: false } : t
      ));

      alert(`注入了${elementType}元素！作物成功演化为【${PLANTS[nextPlant].name}】。`);
    } else {
      alert(`你没有足够的${elementType}元素。去捕捉地图上的灵生物吧！`);
    }
  };

  const handlePurchase = (packId: string, cost: number) => {
    if (fp < cost) {
      alert('宗门贡献不足！');
      return;
    }
    
    if (packId === 'outer') {
      setFp(prev => prev - cost);
      setInventory(inv => ({ ...inv, 'baishizhen-seed-0': (inv['baishizhen-seed-0'] || 0) + 5 }));
      alert('成功领取：外门弟子布袋（白石针种子 [0] x5）');
    } else {
      alert('该物资包暂未开放申请。');
    }
  };

  const cycleWeather = () => {
    const weathers: WeatherType[] = ['SUNNY', 'RAINY', 'STORMY', 'WINDY'];
    const idx = weathers.indexOf(weather);
    setWeather(weathers[(idx + 1) % weathers.length]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-sm bg-slate-950 font-sans select-none">
      {/* Dice Modal */}
      {diceState.isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-blue-500/50 p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full mx-4">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">天道运势</h2>
            <p className="text-slate-400 text-xs mb-8">满足进阶条件，投掷骰子决定是否获得高阶种子</p>
            
            <div className={`w-32 h-32 mx-auto bg-slate-800 rounded-3xl border-4 border-slate-700 flex items-center justify-center text-6xl shadow-inner mb-8 transition-all ${diceState.isRolling ? 'animate-bounce' : ''}`}>
              {diceState.isRolling ? '?' : diceState.value || '🎲'}
            </div>

            <div className="space-y-2 mb-10">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>基础概率</span>
                <span className="text-white">{(diceState.baseChance * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-blue-400">
                <span>骰子加成</span>
                <span className="font-bold">{diceState.value ? `+${diceState.value * 10}%` : '+ (点数 × 10)%'}</span>
              </div>
              <div className="h-px bg-slate-800 my-2"></div>
              <div className="flex justify-between text-xs font-black uppercase text-yellow-500">
                <span>总计概率</span>
                <span className="text-lg">{diceState.value ? `${(diceState.baseChance * 100 + diceState.value * 10).toFixed(0)}%` : '???'}</span>
              </div>
            </div>

            <button 
              onClick={rollDice}
              disabled={diceState.isRolling || diceState.value !== null}
              className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all ${diceState.isRolling || diceState.value !== null ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95'}`}
            >
              {diceState.isRolling ? '运势流转中...' : diceState.value !== null ? '尘埃落定' : '投掷骰子'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="flex space-x-8">
          <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-black">宗门贡献</span><span className="text-xl font-black text-yellow-500">{fp}</span></div>
          <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-black">知识点</span><span className="text-xl font-black text-blue-400">{kp}</span></div>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex bg-slate-800 rounded-full p-1 border border-slate-700 shadow-inner">
            {['FARM', 'LAB', 'QUOTA'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>{tab === 'FARM' ? 'Mirror Earth' : tab === 'LAB' ? 'Brick Farm' : '物资申领'}</button>
            ))}
          </nav>
          <button onClick={cycleWeather} className={`px-6 py-2 rounded-full border border-slate-700 text-xs font-black uppercase transition-all bg-slate-800/50 ${weather === 'SUNNY' ? 'text-orange-400' : 'text-blue-400'}`}>天气: {weather}</button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {activeTab === 'FARM' && (
          <section className="flex-1 p-8 overflow-y-auto custom-scrollbar flex items-center justify-center">
            <div className="grid grid-cols-4 gap-4 p-8 rounded-[2.5rem] border-2 border-slate-800 bg-slate-900/40 shadow-2xl">
              {tiles.map(tile => {
                let state: TileState = 'EMPTY';
                if (tile.plantType) state = tile.growth < 100 ? 'PLANTED' : 'MATURE';

                const tileData: TileData = {
                  id: tile.id,
                  x: tile.x,
                  y: tile.y,
                  state,
                  soilType: tile.soilType,
                  cropType: tile.plantType,
                  progress: tile.growth,
                  hasCreature: tile.hasCreature,
                  creatureType: tile.creatureType,
                  lastSpawnedAt: tile.lastSpawnedAt
                };
                return (
                  <Tile 
                    key={tile.id} 
                    data={tileData}
                    onPlant={handlePlant}
                    onHarvest={handleHarvest}
                    onCollectCreature={handleCollectCreature}
                    onInfuse={handleInfuseElement}
                  />
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'LAB' && (
          <section className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-8 text-center">Brick Farm <span className="text-blue-500">BLUEPRINTS</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {BLUEPRINTS.map(bp => {
                const isCompleted = completedBlueprints.includes(bp.id);
                const hasAll = bp.requiredCrops.every(crop => (inventory[crop] || 0) > 0);

                return (
                  <div key={bp.id} className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${isCompleted ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/40 hover:border-blue-500/30'}`}>
                    {isCompleted && <div className="absolute top-4 right-4 text-emerald-500 font-black uppercase text-[10px] tracking-widest">已完成</div>}
                    <h3 className="text-xl font-black text-white mb-4">{bp.name}</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">{bp.description}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">所需拼图碎片：</div>
                      <div className="flex flex-wrap gap-3">
                        {bp.requiredCrops.map(crop => (
                          <div key={crop} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${inventory[crop] ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-950 text-slate-600'}`}>
                            <span className="text-lg">{PLANTS[crop].icon}</span>
                            <span className="text-[10px] font-black">{PLANTS[crop].name} {inventory[crop] ? `(${inventory[crop]})` : '(0)'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isCompleted && (
                      <button 
                        onClick={() => handleCompleteBlueprint(bp)}
                        className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${hasAll ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                      >
                        {hasAll ? '拼入拼图并解锁知识' : '碎片不足，前往探索'}
                      </button>
                    )}
                    
                    {isCompleted && (
                      <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">已解锁的知识：</div>
                        <p className="text-[11px] text-slate-300 italic">“{PLANTS[bp.requiredCrops[0]].educationalDescription}”</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'QUOTA' && (
          <section className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-12 text-center">物资申领系统 <span className="text-blue-500">QUOTA SYSTEM</span></h2>
            <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
              {PACKS.map(pack => (
                <div key={pack.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all shadow-lg">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform">📦</div>
                  <h3 className="text-sm font-black text-white mb-2 uppercase">{pack.name}</h3>
                  <div className="text-xl font-black text-yellow-500 mb-6">{pack.cost} <span className="text-[10px] opacity-60">FP</span></div>
                  <button 
                    onClick={() => handlePurchase(pack.id, pack.cost)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg transition-all active:scale-95"
                  >
                    提交申请
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer / Action Bar */}
      <footer className="h-44 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 flex p-6 space-x-8 z-10 relative">
        <div className="flex-1 flex space-x-5 overflow-x-auto custom-scrollbar pb-2 items-center pr-10">
          <div className="flex flex-col space-y-2 mr-4 min-w-[150px]">
             <div className="text-[9px] font-black text-blue-400 uppercase">资源 & 元素 RESOURCES</div>
             <ResourceMini label="💧" value={resources.water} color="bg-blue-500" count={elementInventory.water} />
             <ResourceMini label="☀️" value={resources.sunlight} color="bg-yellow-500" count={elementInventory.sun} />
             <ResourceMini label="🔥" value={resources.fertilizer} color="bg-orange-500" count={elementInventory.fire} />
          </div>

          <div className="w-[2px] h-20 bg-white/5 rounded-full mx-2 shrink-0"></div>

          {unlockedCrops.filter(type => type.includes('seed')).map(type => (
            <div key={type} onClick={() => setSelectedPlant(type)}
              className={`min-w-[130px] h-32 rounded-[2rem] border-2 p-5 cursor-pointer transition-all flex flex-col justify-between relative group
                ${selectedPlant === type ? 'border-blue-400 -translate-y-4 bg-slate-800 shadow-2xl' : 'border-white/5 bg-slate-800/40 shadow-inner'}
              `}
            >
              <div className="absolute top-3 right-4 text-[10px] font-black text-blue-400">{inventory[type] || 0}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase mb-1">{PLANTS[type].category} · {getPlantStage(type)}</div>
              <div className="text-xl">{PLANTS[type].icon}</div>
              <div className="text-xs font-black text-white leading-tight">{PLANTS[type].name}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsBackpackOpen(true)}
          className="w-64 bg-slate-800/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col items-center justify-center shadow-inner hover:bg-slate-700/60 transition-all group"
        >
           <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎒</div>
           <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">宗门行囊 <span className="text-slate-500 opacity-50">BACKPACK</span></div>
        </button>
      </footer>

      {/* Backpack Modal */}
      {isBackpackOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-10">
          <div className="bg-slate-900 border border-white/10 rounded-[3.5rem] shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
            <header className="p-10 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">宗门行囊 <span className="text-blue-500">BACKPACK</span></h2>
                <p className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-widest">存放已收获的各类灵植产物</p>
              </div>
              <button 
                onClick={() => setIsBackpackOpen(false)}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-xl text-white transition-all"
              >
                ✕
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {unlockedCrops.filter(type => !type.includes('seed')).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {unlockedCrops.filter(type => !type.includes('seed')).map(type => (
                    <div key={type} className="bg-slate-800/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-inner group hover:border-blue-500/30 transition-all">
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{PLANTS[type].icon}</div>
                      <div className="text-xs font-black text-white mb-1">{PLANTS[type].name}</div>
                      <div className="text-[10px] font-black text-blue-400 uppercase mb-4">{inventory[type] || 0} 单位</div>
                      <div className="text-[9px] text-slate-500 italic leading-tight px-2">{PLANTS[type].description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <div className="text-6xl grayscale opacity-20">🌾</div>
                  <div className="text-xs font-black uppercase tracking-widest">行囊空空如也</div>
                </div>
              )}
            </div>

            <footer className="p-8 bg-slate-950/50 border-t border-white/5 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">提示：作物可用于完成【Brick Farm】拼图以获取知识点</p>
            </footer>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {isGameFinished && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
           <div className="text-center p-12 bg-slate-900 border border-white/10 rounded-[3.5rem] shadow-2xl">
              <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Masterpiece Complete</h1>
              <p className="text-slate-400 mb-10 text-lg">Your botanical tapestry is preserved.</p>
              <button 
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-sm shadow-xl transition-all active:scale-95" 
                onClick={() => window.location.reload()}
              >
                RESTART JOURNEY
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function getPlantStage(type: PlantType): string {
  if (type.startsWith('baishizhen')) return '野草';
  if (type.startsWith('yuzhuxu')) return '蜕变中';
  if (type.startsWith('white-jade-rice')) return '作物';
  if (type === 'chiyan-rice' || type === 'jiahe-rice') return '品种';
  if (type.includes('spirit') || type === 'lingsong' || type === 'lantern') return '作物';
  return '野草';
}

function ResourceMini({ label, value, color, count }: { label: string, value: number, color: string, count: number }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col items-center min-w-[24px]">
        <span className="text-[10px] grayscale brightness-150">{label}</span>
        <span className="text-[8px] font-bold text-white mt-0.5">{count}</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

export default App;
