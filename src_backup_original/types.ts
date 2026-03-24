export type PlantType = 'lavender' | 'sunflower' | 'fern' | 'wild-honey';

export interface PlantInfo {
  id: PlantType;
  name: string;
  color: string;
  waterReq: number;
  sunReq: number;
  fertReq: number;
  description: string;
  icon: string;
  pattern: string;
}

export const PLANTS: Record<PlantType, PlantInfo> = {
  'lavender': {
    id: 'lavender',
    name: 'Lavender',
    color: '#9B59B6',
    waterReq: 10,
    sunReq: 30,
    fertReq: 5,
    description: 'High sun requirement, creates a soft purple aesthetic.',
    icon: '🪻',
    pattern: 'lavender-pattern'
  },
  'sunflower': {
    id: 'sunflower',
    name: 'Sunflower',
    color: '#F1C40F',
    waterReq: 25,
    sunReq: 40,
    fertReq: 10,
    description: 'Needs significant sun and water, adds vibrant yellow tones.',
    icon: '🌻',
    pattern: 'sunflower-pattern'
  },
  'fern': {
    id: 'fern',
    name: 'Fern',
    color: '#27AE60',
    waterReq: 35,
    sunReq: 5,
    fertReq: 5,
    description: 'Thrives in water and shade, providing lush emerald greens.',
    icon: '🌿',
    pattern: 'fern-pattern'
  },
  'wild-honey': {
    id: 'wild-honey',
    name: 'Wild Honey',
    color: '#D35400',
    waterReq: 15,
    sunReq: 15,
    fertReq: 30,
    description: 'A unique honeycomb-patterned tile that requires specialized fertilizer.',
    icon: '🍯',
    pattern: 'honey-pattern'
  }
};

export type CreatureType = 'WATER' | 'SUN' | 'FIRE';

export interface TileState {
  id: number;
  x: number;
  y: number;
  plantType: PlantType | null;
  growth: number;
  isLocked: boolean;
  hasCreature: boolean;
  creatureType?: CreatureType;
  lastSpawnedAt?: number;
}

export interface GameResources {
  water: number;
  sunlight: number;
  fertilizer: number;
}

export interface ElementInventory {
  water: number;
  sun: number;
  fire: number;
}
