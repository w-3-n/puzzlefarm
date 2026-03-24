import { Blueprint } from './types';
export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'lingxu-foundation',
    name: '龙须草起源',
    requiredCrops: ['lingxu'],
    description: '收集最基础的龙须草，它是所有进化的起点。',
    rewardKP: 50
  },
  {
    id: 'rice-evolution-1',
    name: '基础灵稻拼图',
    requiredCrops: ['white-jade-rice'],
    description: '收集通过黄色元素演化出的白玉灵稻，开启灵能农业的第一步。',
    rewardKP: 150
  },
  {
    id: 'rice-evolution-2',
    name: '进阶羊脂拼图',
    requiredCrops: ['suet-jade-rice'],
    description: '火元素的力量让灵稻产生了质变，收集羊脂玉稻以解锁更高深的生物知识。',
    rewardKP: 300
  },
  {
    id: 'rice-evolution-3',
    name: '终极龙鳞拼图',
    requiredCrops: ['dragon-scale-rice'],
    description: '唯有在水元素的极致引导下，才能培育出传说中的龙鳞稻。',
    rewardKP: 1000
  },
  {
    id: 'rice-blueprint',
    name: '古代稻作拼图',
    requiredCrops: ['lingxu', 'spirit-rice'],
    description: '通过收集野生稻和改良稻，还原人类最早的耕作模式。',
    rewardKP: 100
  }
];
