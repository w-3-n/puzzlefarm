import { Crop, TerrainType, Blueprint } from './types';
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

export const CROPS: Crop[] = [
  {
    id: '1',
    name: '灵须草',
    realName: '普通野生稻',
    scientificName: 'Oryza rufipogon',
    category: '粮食',
    grade: 0,
    terrain: 'WETLAND',
    growthTime: 4,
    h2oRange: [0, 100],
    sellPrice: 25,
    description: '初始野生形态。',
    educationalDescription: '普通野生稻是现代栽培稻的祖先，拥有极高的遗传多样性，是改良作物抗逆性的重要基因库。',
    researchHint: '“深厚的土壤养分能让种子变得沉重而饱满。”',
    isSeed: true
  },
  {
    id: '2',
    name: '灵茸草',
    realName: '狗尾草',
    scientificName: 'Setaria viridis',
    category: '粮食',
    grade: 0,
    terrain: 'GRASSLAND',
    growthTime: 6,
    h2oRange: [0, 20],
    sellPrice: 45,
    description: '初始野生形态。',
    educationalDescription: '狗尾草采用 C4 光合作用，使其能在高温和低水环境下通过高效转化能量茁壮成长。',
    researchHint: '“只有被大地之母眷顾时，这种草才会长得厚实。”',
    isSeed: true
  },
  {
    id: '7',
    name: '芸灵草',
    realName: '野生芸薹',
    scientificName: 'Brassica oleracea',
    category: '蔬菜',
    grade: 0,
    terrain: 'GRASSLAND',
    growthTime: 8,
    h2oRange: [70, 90],
    sellPrice: 60,
    description: '筑基期起始野草。',
    educationalDescription: '西兰花、甘蓝和羽衣甘蓝的共同祖先，展现了惊人的“形态可塑性”。',
    researchHint: '“恒定的滋润是洗去野生苦味的秘诀。”',
    isSeed: true
  },
  {
    id: '9',
    name: '绯灵木',
    realName: '光核桃',
    scientificName: 'Prunus mira',
    category: '水果',
    grade: 0,
    terrain: 'FOREST',
    growthTime: 15,
    h2oRange: [40, 60],
    sellPrice: 120,
    description: '起始野树品种。',
    educationalDescription: '光核桃原产于喜马拉雅地区，以果核平滑和极强的耐寒性著称。',
    researchHint: '“若要结出更大的果实，根系必须浸透在养分中。”',
    isSeed: true
  }
];

export const INITIAL_GRID = (): any[] => {
  const terrains: TerrainType[] = ['WETLAND', 'GRASSLAND', 'FOREST', 'ROCKY'];
  const grid = [];
  for (const terrain of terrains) {
    for (let i = 0; i < 3; i++) {
      grid.push({
        id: `${terrain}-STD-${i}`,
        terrain,
        type: 'STANDARD',
        crop: null,
        growthProgress: 0,
        h2o: 50,
        n: 100,
        isReady: false,
        persistenceCount: 0,
        highNutrientTimer: 0,
        perfectH2OTimer: 0
      });
    }
    grid.push({
      id: `${terrain}-MYST-0`,
      terrain,
      type: 'MYSTERY',
      crop: null,
      growthProgress: 0,
      h2o: 50,
      n: 100,
      isReady: false,
      persistenceCount: 0,
      highNutrientTimer: 0,
      perfectH2OTimer: 0
    });
  }
  return grid;
};