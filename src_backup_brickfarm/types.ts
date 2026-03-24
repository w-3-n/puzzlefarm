export type TileState = 'EMPTY' | 'PLANTED' | 'MATURE';

export type CropType = 'WHEAT' | 'CARROT' | 'PUMPKIN';

export interface CropDef {
  type: CropType;
  icon: string;
  growTime: number; // in seconds
  color: string;
}

export const CROPS: Record<CropType, CropDef> = {
  WHEAT: { type: 'WHEAT', icon: '🌾', growTime: 5, color: '#f3e5ab' },
  CARROT: { type: 'CARROT', icon: '🥕', growTime: 8, color: '#ff7518' },
  PUMPKIN: { type: 'PUMPKIN', icon: '🎃', growTime: 12, color: '#ff7518' },
};

export interface TileData {
  id: number;
  state: TileState;
  cropType?: CropType;
  progress: number; // 0 to 100
  hasCreature: boolean;
  creatureType: 'WATER' | 'SUN' | 'FIRE';
  lastSpawnedAt?: number; // Unique key helper
}

export interface Inventory {
  water: number;
  sun: number;
  fire: number;
  wheat: number;
  carrot: number;
  pumpkin: number;
}
