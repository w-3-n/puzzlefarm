import { Blueprint, PlantType, SoilType, CreatureType } from './types';

export interface UpgradeRule {
  source: PlantType;
  landCondition?: SoilType;
  elementCondition?: CreatureType;
  elementCount?: number;
  otherCondition?: string;
  target: PlantType;
  baseChance: number;
  hasDice: boolean;
}

export const UPGRADE_RULES: UpgradeRule[] = [
  // Baishizhen path
  { source: 'baishizhen-0', landCondition: 'WET', target: 'baishizhen-seed-1', baseChance: 0.02, hasDice: true },
  { source: 'baishizhen-1', landCondition: 'WET', target: 'baishizhen-seed-2', baseChance: 0.02, hasDice: true },
  { source: 'baishizhen-2', landCondition: 'WET', target: 'baishizhen-seed-3', baseChance: 0.02, hasDice: true },
  { source: 'baishizhen-3', landCondition: 'WET', target: 'yuzhuxu-seed-0', baseChance: 0.02, hasDice: true },
  
  // Yuzhuxu path
  { source: 'yuzhuxu-0', elementCondition: 'FIRE', target: 'yuzhuxu-seed-1', baseChance: 0.02, hasDice: true },
  { source: 'yuzhuxu-1', elementCondition: 'FIRE', target: 'yuzhuxu-seed-2', baseChance: 0.02, hasDice: true },
  { source: 'yuzhuxu-2', elementCondition: 'FIRE', target: 'yuzhuxu-seed-3', baseChance: 0.02, hasDice: true },
  { source: 'yuzhuxu-3', elementCondition: 'FIRE', target: 'white-jade-rice-seed-0', baseChance: 0.02, hasDice: true },
  
  // White Jade Rice path
  { source: 'white-jade-rice-0', elementCondition: 'FIRE', target: 'white-jade-rice-seed-1', baseChance: 0.02, hasDice: true },
  { source: 'white-jade-rice-1', elementCondition: 'FIRE', target: 'white-jade-rice-seed-2', baseChance: 0.02, hasDice: true },
  { source: 'white-jade-rice-2', elementCondition: 'FIRE', target: 'white-jade-rice-seed-3', baseChance: 0.02, hasDice: true },
  
  // Special White Jade Rice [3] upgrades
  { source: 'white-jade-rice-3', elementCondition: 'FIRE', otherCondition: 'ADJACENT_BAISHIZHEN', target: 'jiahe-rice-seed', baseChance: 1.0, hasDice: false },
  { source: 'white-jade-rice-3', elementCondition: 'FIRE', elementCount: 2, target: 'chiyan-rice-seed', baseChance: 1.0, hasDice: false },
];

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'baishizhen-evolution',
    name: '白石针的蜕变',
    requiredCrops: ['baishizhen-3'],
    description: '见证野草向灵植的最初跨越。',
    rewardKP: 100
  },
  {
    id: 'yuzhuxu-perfection',
    name: '玉珠须的极致',
    requiredCrops: ['yuzhuxu-3'],
    description: '通过火元素的洗礼，让玉珠须达到完美的平衡。',
    rewardKP: 250
  },
  {
    id: 'white-jade-ultimate',
    name: '白玉灵稻之光',
    requiredCrops: ['white-jade-rice-3'],
    description: '培育出最高等级的白玉灵稻。',
    rewardKP: 500
  },
  {
    id: 'special-rice-varieties',
    name: '异变稻种录',
    requiredCrops: ['chiyan-rice', 'jiahe-rice'],
    description: '收集因特殊环境产生的变异稻种。',
    rewardKP: 1000
  }
];
