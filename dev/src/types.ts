export type PlantType = 
  | 'lingxu' | 'lingrong' | 'lingli' | 'spirit-rice' | 'spirit-millet' | 'spirit-wheat'
  | 'yunling' | 'lingsong'
  | 'feiling' | 'spirit-peach'
  | 'qingling' | 'spirit-tea'
  | 'hongguo' | 'spirit-ginseng'
  | 'lantern' | 'spirit-pepper'
  | 'cairong' | 'spirit-cotton'
  | 'baishizhen-0' | 'baishizhen-1' | 'baishizhen-2' | 'baishizhen-3'
  | 'baishizhen-seed-0' | 'baishizhen-seed-1' | 'baishizhen-seed-2' | 'baishizhen-seed-3'
  | 'yuzhuxu-0' | 'yuzhuxu-1' | 'yuzhuxu-2' | 'yuzhuxu-3'
  | 'yuzhuxu-seed-0' | 'yuzhuxu-seed-1' | 'yuzhuxu-seed-2' | 'yuzhuxu-seed-3'
  | 'white-jade-rice-0' | 'white-jade-rice-1' | 'white-jade-rice-2' | 'white-jade-rice-3'
  | 'white-jade-rice-seed-0' | 'white-jade-rice-seed-1' | 'white-jade-rice-seed-2' | 'white-jade-rice-seed-3'
  | 'chiyan-rice' | 'chiyan-rice-seed'
  | 'jiahe-rice' | 'jiahe-rice-seed';

export interface DiceState {
  isVisible: boolean;
  value: number | null;
  targetTileId: number | null;
  baseChance: number;
  upgradeTarget: PlantType;
  isRolling: boolean;
}

export type SoilType = 'WET' | 'DRY' | 'RICH' | 'ROCKY';

export interface PlantInfo {
  id: PlantType;
  name: string;
  scientificName: string;
  category: '粮食' | '蔬菜' | '水果' | '饮料' | '药材' | '调料' | '原料';
  waterReq: number;
  sunReq: number;
  fertReq: number;
  description: string;
  educationalDescription: string;
  rewardText: string;
  icon: string;
  pattern: string;
  basePrice: number;
  tier?: number; // 0: Wild, 1: Awakened, 2: Evolved, 3: Masterpiece
  lineage?: string; // e.g., 'baishizhen', 'yuzhuxu', 'white-jade-rice'
}

export const PLANTS: Record<PlantType, PlantInfo> = {
  'lingxu': {
    id: 'lingxu',
    name: '灵须草',
    scientificName: 'Oryza rufipogon',
    category: '粮食',
    waterReq: 20, sunReq: 20, fertReq: 10,
    description: '现代栽培稻的祖先。',
    educationalDescription: '普通野生稻是现代栽培稻的祖先，拥有极高的遗传多样性，是改良作物抗逆性的重要基因库。',
    rewardText: '解锁“水分保持”提示。',
    icon: '🌾', pattern: 'rice-pattern', basePrice: 25
  },
  'lingrong': {
    id: 'lingrong',
    name: '灵茸草',
    scientificName: 'Setaria',
    category: '粮食',
    waterReq: 10, sunReq: 40, fertReq: 10,
    description: '能在高温环境下茁壮成长。',
    educationalDescription: '狗尾草采用 C4 光合作用，使其能在高温和低水环境下通过高效转化能量茁壮成长。',
    rewardText: '解锁“土壤传感器”技术。',
    icon: '🌿', pattern: 'bristle-pattern', basePrice: 30
  },
  'lingli': {
    id: 'lingli',
    name: '灵粒草',
    scientificName: 'Wild Millet',
    category: '粮食',
    waterReq: 5, sunReq: 50, fertReq: 5,
    description: '极强的抗旱性。',
    educationalDescription: '野粟具有极强的抗旱性，能在其他谷物无法生存的贫瘠岩石土壤中生长。',
    rewardText: '灵粒草在晴天生长速度 +10%。',
    icon: '🌾', pattern: 'millet-pattern', basePrice: 35
  },
  'spirit-rice': {
    id: 'spirit-rice',
    name: '灵稻',
    scientificName: 'Oryza sativa',
    category: '粮食',
    waterReq: 50, sunReq: 30, fertReq: 20,
    description: '栽培水稻。',
    educationalDescription: '栽培水稻因能在淹水环境中生长而独具特色，这种环境能天然抑制杂草生长。',
    rewardText: '灵稻基础售价 +$10。',
    icon: '🍚', pattern: 'rice-cult-pattern', basePrice: 50
  },
  'spirit-millet': {
    id: 'spirit-millet',
    name: '灵谷',
    scientificName: 'Millet',
    category: '粮食',
    waterReq: 10, sunReq: 40, fertReq: 15,
    description: '干旱地区粮食安全的关键。',
    educationalDescription: '谷子的水足迹极低且生长周期短，是干旱地区粮食安全的关键作物。',
    rewardText: '分析时获得的知识点 (KP) 增加 10%。',
    icon: '🥣', pattern: 'millet-cult-pattern', basePrice: 45
  },
  'spirit-wheat': {
    id: 'spirit-wheat',
    name: '灵麦',
    scientificName: 'Triticum',
    category: '粮食',
    waterReq: 30, sunReq: 30, fertReq: 25,
    description: '蛋白质的主要来源。',
    educationalDescription: '小麦提供的蛋白质超过任何其他主要谷物，是人类饮食中植物蛋白的主要来源。',
    rewardText: '灵麦生长速度 +15%。',
    icon: '🍞', pattern: 'wheat-pattern', basePrice: 55
  },
  'yunling': {
    id: 'yunling',
    name: '芸灵草',
    scientificName: 'Brassica oleracea',
    category: '蔬菜',
    waterReq: 25, sunReq: 20, fertReq: 15,
    description: '惊人的形态可塑性。',
    educationalDescription: '西兰花、甘蓝和羽衣甘蓝的共同祖先，展现了惊人的“形态可塑性”。',
    rewardText: '芸灵草样本售价 +10%。',
    icon: '🥬', pattern: 'brassica-pattern', basePrice: 40
  },
  'lingsong': {
    id: 'lingsong',
    name: '灵菘',
    scientificName: 'Brassica napus',
    category: '蔬菜',
    waterReq: 30, sunReq: 35, fertReq: 20,
    description: '富含油脂的种子。',
    educationalDescription: '油菜因其富含油脂的种子而被广泛种植；其明亮的黄花是授粉昆虫的重要蜜源。',
    rewardText: '肥料氮元素效率 +5%。',
    icon: '🌼', pattern: 'rape-pattern', basePrice: 45
  },
  'feiling': {
    id: 'feiling',
    name: '绯灵木',
    scientificName: 'Prunus mira',
    category: '水果',
    waterReq: 20, sunReq: 40, fertReq: 15,
    description: '极强的耐寒性。',
    educationalDescription: '光核桃原产于喜马拉雅地区，以果核平滑和极强的耐寒性著称。',
    rewardText: '分析绯灵木可获得 +15% KP。',
    icon: '🍑', pattern: 'peach-wild-pattern', basePrice: 80
  },
  'spirit-peach': {
    id: 'spirit-peach',
    name: '灵桃树',
    scientificName: 'Prunus persica',
    category: '水果',
    waterReq: 35, sunReq: 45, fertReq: 25,
    description: '栽培历史悠久。',
    educationalDescription: '栽培桃起源于中国，已有 4000 多年的栽培历史。',
    rewardText: '灵桃基础售价 +$30。',
    icon: '🍑', pattern: 'peach-cult-pattern', basePrice: 120
  },
  'qingling': {
    id: 'qingling',
    name: '青灵木',
    scientificName: 'Camellia sinensis var. pubilimba',
    category: '饮料',
    waterReq: 40, sunReq: 15, fertReq: 20,
    description: '高大的乔木茶树。',
    educationalDescription: '野生茶树能长成超过 10 米的高大乔木，寿命可达数百年。',
    rewardText: '解锁“高级灌溉”技术折扣。',
    icon: '🌳', pattern: 'tea-wild-pattern', basePrice: 100
  },
  'spirit-tea': {
    id: 'spirit-tea',
    name: '灵茶树',
    scientificName: 'Camellia sinensis',
    category: '饮料',
    waterReq: 45, sunReq: 20, fertReq: 30,
    description: '放松且清醒。',
    educationalDescription: '茶叶含有茶氨酸和咖啡因，能提供一种独特的放松且清醒的状态。',
    rewardText: '灵茶售价 +15%。',
    icon: '🍵', pattern: 'tea-cult-pattern', basePrice: 150
  },
  'hongguo': {
    id: 'hongguo',
    name: '红果草',
    scientificName: 'Panax',
    category: '药材',
    waterReq: 30, sunReq: 10, fertReq: 40,
    description: '对环境极其敏感。',
    educationalDescription: '这些生长缓慢的多年生植物对土壤 pH 值 and 森林光照水平极其敏感。',
    rewardText: '分析红果草可获得 +20% KP。',
    icon: '🍒', pattern: 'panax-wild-pattern', basePrice: 150
  },
  'spirit-ginseng': {
    id: 'spirit-ginseng',
    name: '灵参',
    scientificName: 'Panax ginseng',
    category: '药材',
    waterReq: 40, sunReq: 15, fertReq: 50,
    description: '重要的适应原。',
    educationalDescription: '人参含有的人参皂苷是一种适应原，能帮助身体应对生理和心理压力。',
    rewardText: '灵参基础售价 +$50。',
    icon: '🎋', pattern: 'ginseng-cult-pattern', basePrice: 300
  },
  'lantern': {
    id: 'lantern',
    name: '灯笼草',
    scientificName: 'Capsicum',
    category: '调料',
    waterReq: 15, sunReq: 45, fertReq: 15,
    description: '鸟类传播的野生辣椒。',
    educationalDescription: '野生辣椒长有细小、直立的果实，专门设计用于通过鸟类进行传播。',
    rewardText: '灯笼草在干旱中的存活时间延长 50%。',
    icon: '🌶️', pattern: 'chili-wild-pattern', basePrice: 60
  },
  'spirit-pepper': {
    id: 'spirit-pepper',
    name: '灵椒',
    scientificName: 'Capsicum annuum',
    category: '调料',
    waterReq: 25, sunReq: 50, fertReq: 20,
    description: '进化防御机制。',
    educationalDescription: '辣椒素的进化是一种防御机制，既能防止哺乳动物食用，也能在潮湿环境中防止真菌感染。',
    rewardText: '灵椒售价 +15%。',
    icon: '🌶️', pattern: 'chili-cult-pattern', basePrice: 90
  },
  'cairong': {
    id: 'cairong',
    name: '彩绒草',
    scientificName: 'Gossypium raimondii',
    category: '原料',
    waterReq: 15, sunReq: 55, fertReq: 20,
    description: '第一个完成全基因组测序。',
    educationalDescription: '原产于秘鲁的野生棉花，是第一个完成全基因组测序的棉花物种。',
    rewardText: '解锁“高级传感器”折扣。',
    icon: '☁️', pattern: 'cotton-wild-pattern', basePrice: 70
  },
  'spirit-cotton': {
    id: 'spirit-cotton',
    name: '灵棉',
    scientificName: 'Gossypium',
    category: '原料',
    waterReq: 25, sunReq: 60, fertReq: 30,
    description: '用于风力传播的纤维。',
    educationalDescription: '棉花产生“皮棉”——旨在帮助种子随风传播的长纤维素纤维。',
    rewardText: '灵棉生长速度 +15%。',
    icon: '👕', pattern: 'cotton-cult-pattern', basePrice: 110
  },
  'baishizhen-0': {
    id: 'baishizhen-0', name: '白石针 [0]', scientificName: 'Oryza rufipogon var. alba 0', category: '粮食',
    waterReq: 20, sunReq: 20, fertReq: 10, description: '基础野草形态。', educationalDescription: '最初级的白石针，生命力顽强。', rewardText: '基础产物。', icon: '🌱', pattern: 'baishi-0-pattern', basePrice: 10,
    tier: 0, lineage: 'baishizhen'
  },
  'baishizhen-1': {
    id: 'baishizhen-1', name: '白石针 [1]', scientificName: 'Oryza rufipogon var. alba 1', category: '粮食',
    waterReq: 25, sunReq: 20, fertReq: 15, description: '进阶野草形态。', educationalDescription: '初步展现灵气的白石针。', rewardText: '一阶段产物。', icon: '🌿', pattern: 'baishi-1-pattern', basePrice: 20,
    tier: 1, lineage: 'baishizhen'
  },
  'baishizhen-2': {
    id: 'baishizhen-2', name: '白石针 [2]', scientificName: 'Oryza rufipogon var. alba 2', category: '粮食',
    waterReq: 30, sunReq: 25, fertReq: 20, description: '高级野草形态。', educationalDescription: '灵气充盈的白石针。', rewardText: '二阶段产物。', icon: '☘️', pattern: 'baishi-2-pattern', basePrice: 40,
    tier: 2, lineage: 'baishizhen'
  },
  'baishizhen-3': {
    id: 'baishizhen-3', name: '白石针 [3]', scientificName: 'Oryza rufipogon var. alba 3', category: '粮食',
    waterReq: 35, sunReq: 30, fertReq: 25, description: '巅峰野草形态。', educationalDescription: '即将发生质变的白石针。', rewardText: '三阶段产物。', icon: '🌾', pattern: 'baishi-3-pattern', basePrice: 80,
    tier: 3, lineage: 'baishizhen'
  },
  'baishizhen-seed-0': { id: 'baishizhen-seed-0', name: '白石针种子 [0]', scientificName: 'Semen 0', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '白石针的原始种子。', educationalDescription: '最基础的生命之源。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 5, tier: 0, lineage: 'baishizhen' },
  'baishizhen-seed-1': { id: 'baishizhen-seed-1', name: '白石针种子 [1]', scientificName: 'Semen 1', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '进阶种子。', educationalDescription: '进阶种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 10, tier: 1, lineage: 'baishizhen' },
  'baishizhen-seed-2': { id: 'baishizhen-seed-2', name: '白石针种子 [2]', scientificName: 'Semen 2', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '高级种子。', educationalDescription: '高级种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 20, tier: 2, lineage: 'baishizhen' },
  'baishizhen-seed-3': { id: 'baishizhen-seed-3', name: '白石针种子 [3]', scientificName: 'Semen 3', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '巅峰种子。', educationalDescription: '巅峰种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 40, tier: 3, lineage: 'baishizhen' },

  'yuzhuxu-0': {
    id: 'yuzhuxu-0', name: '玉珠须 [0]', scientificName: 'Oryza perlata 0', category: '粮食',
    waterReq: 40, sunReq: 30, fertReq: 30, description: '蜕变初始态。', educationalDescription: '白石针质变后的产物。', rewardText: '蜕变产物。', icon: '✨', pattern: 'yuzhu-0-pattern', basePrice: 150,
    tier: 0, lineage: 'yuzhuxu'
  },
  'yuzhuxu-1': {
    id: 'yuzhuxu-1', name: '玉珠须 [1]', scientificName: 'Oryza perlata 1', category: '粮食',
    waterReq: 45, sunReq: 35, fertReq: 35, description: '蜕变一阶段。', educationalDescription: '蜕变一阶段。', rewardText: '蜕变产物。', icon: '✨', pattern: 'yuzhu-1-pattern', basePrice: 200,
    tier: 1, lineage: 'yuzhuxu'
  },
  'yuzhuxu-2': {
    id: 'yuzhuxu-2', name: '玉珠须 [2]', scientificName: 'Oryza perlata 2', category: '粮食',
    waterReq: 50, sunReq: 40, fertReq: 40, description: '蜕变二阶段。', educationalDescription: '蜕变二阶段。', rewardText: '蜕变产物。', icon: '✨', pattern: 'yuzhu-2-pattern', basePrice: 300,
    tier: 2, lineage: 'yuzhuxu'
  },
  'yuzhuxu-3': {
    id: 'yuzhuxu-3', name: '玉珠须 [3]', scientificName: 'Oryza perlata 3', category: '粮食',
    waterReq: 55, sunReq: 45, fertReq: 45, description: '蜕变三阶段。', educationalDescription: '蜕变三阶段。', rewardText: '蜕变产物。', icon: '✨', pattern: 'yuzhu-3-pattern', basePrice: 500,
    tier: 3, lineage: 'yuzhuxu'
  },
  'yuzhuxu-seed-0': { id: 'yuzhuxu-seed-0', name: '玉珠须种子 [0]', scientificName: 'Semen Y 0', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '玉珠须种子。', educationalDescription: '玉珠须种子。', rewardText: '开启种植。', icon: '🧬', pattern: 'seed-pattern', basePrice: 50, tier: 0, lineage: 'yuzhuxu' },
  'yuzhuxu-seed-1': { id: 'yuzhuxu-seed-1', name: '玉珠须种子 [1]', scientificName: 'Semen Y 1', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '玉珠须种子。', educationalDescription: '玉珠须种子。', rewardText: '开启种植。', icon: '🧬', pattern: 'seed-pattern', basePrice: 75, tier: 1, lineage: 'yuzhuxu' },
  'yuzhuxu-seed-2': { id: 'yuzhuxu-seed-2', name: '玉珠须种子 [2]', scientificName: 'Semen Y 2', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '玉珠须种子。', educationalDescription: '玉珠须种子。', rewardText: '开启种植。', icon: '🧬', pattern: 'seed-pattern', basePrice: 100, tier: 2, lineage: 'yuzhuxu' },
  'yuzhuxu-seed-3': { id: 'yuzhuxu-seed-3', name: '玉珠须种子 [3]', scientificName: 'Semen Y 3', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '玉珠须种子。', educationalDescription: '玉珠须种子。', rewardText: '开启种植。', icon: '🧬', pattern: 'seed-pattern', basePrice: 150, tier: 3, lineage: 'yuzhuxu' },

  'white-jade-rice-0': {
    id: 'white-jade-rice-0', name: '白玉灵稻 [0]', scientificName: 'Oryza alba 0', category: '粮食',
    waterReq: 50, sunReq: 40, fertReq: 50, description: '灵稻初始态。', educationalDescription: '吸收了大地精粹后形成的灵稻。', rewardText: '灵稻产物。', icon: '🍚', pattern: 'rice-0-pattern', basePrice: 800,
    tier: 0, lineage: 'white-jade-rice'
  },
  'white-jade-rice-1': {
    id: 'white-jade-rice-1', name: '白玉灵稻 [1]', scientificName: 'Oryza alba 1', category: '粮食',
    waterReq: 55, sunReq: 45, fertReq: 55, description: '灵稻一阶段。', educationalDescription: '灵稻一阶段。', rewardText: '灵稻产物。', icon: '🍚', pattern: 'rice-1-pattern', basePrice: 1000,
    tier: 1, lineage: 'white-jade-rice'
  },
  'white-jade-rice-2': {
    id: 'white-jade-rice-2', name: '白玉灵稻 [2]', scientificName: 'Oryza alba 2', category: '粮食',
    waterReq: 60, sunReq: 50, fertReq: 60, description: '灵稻二阶段。', educationalDescription: '灵稻二阶段。', rewardText: '灵稻产物。', icon: '🍚', pattern: 'rice-2-pattern', basePrice: 1500,
    tier: 2, lineage: 'white-jade-rice'
  },
  'white-jade-rice-3': {
    id: 'white-jade-rice-3', name: '白玉灵稻 [3]', scientificName: 'Oryza alba 3', category: '粮食',
    waterReq: 65, sunReq: 55, fertReq: 65, description: '灵稻三阶段。', educationalDescription: '灵稻三阶段。', rewardText: '灵稻产物。', icon: '🍚', pattern: 'rice-3-pattern', basePrice: 2000,
    tier: 3, lineage: 'white-jade-rice'
  },
  'white-jade-rice-seed-0': { id: 'white-jade-rice-seed-0', name: '白玉灵稻种子 [0]', scientificName: 'Semen W 0', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '白玉灵稻种子。', educationalDescription: '白玉灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 300, tier: 0, lineage: 'white-jade-rice' },
  'white-jade-rice-seed-1': { id: 'white-jade-rice-seed-1', name: '白玉灵稻种子 [1]', scientificName: 'Semen W 1', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '白玉灵稻种子。', educationalDescription: '白玉灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 400, tier: 1, lineage: 'white-jade-rice' },
  'white-jade-rice-seed-2': { id: 'white-jade-rice-seed-2', name: '白玉灵稻种子 [2]', scientificName: 'Semen W 2', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '白玉灵稻种子。', educationalDescription: '白玉灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 500, tier: 2, lineage: 'white-jade-rice' },
  'white-jade-rice-seed-3': { id: 'white-jade-rice-seed-3', name: '白玉灵稻种子 [3]', scientificName: 'Semen W 3', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '白玉灵稻种子。', educationalDescription: '白玉灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 800, tier: 3, lineage: 'white-jade-rice' },

  'chiyan-rice': {
    id: 'chiyan-rice', name: '赤炎灵稻', scientificName: 'Oryza ignis', category: '粮食',
    waterReq: 40, sunReq: 80, fertReq: 80, description: '蕴含强烈火灵力的灵稻。', educationalDescription: '在双重火元素洗礼下诞生的异种。', rewardText: '完成特殊进化。', icon: '🔥', pattern: 'chiyan-pattern', basePrice: 5000,
    tier: 3, lineage: 'white-jade-rice'
  },
  'chiyan-rice-seed': { id: 'chiyan-rice-seed', name: '赤炎灵稻种子', scientificName: 'Semen Ignis', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '稀有的赤炎灵稻种子。', educationalDescription: '稀有的赤炎灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 2000, tier: 3, lineage: 'white-jade-rice' },

  'jiahe-rice': {
    id: 'jiahe-rice', name: '嘉禾灵稻', scientificName: 'Oryza jiahe', category: '粮食',
    waterReq: 60, sunReq: 40, fertReq: 60, description: '象征祥瑞的灵稻。', educationalDescription: '在白石针环绕下感应而生的瑞草。', rewardText: '完成特殊进化。', icon: '🌾', pattern: 'jiahe-pattern', basePrice: 5000,
    tier: 3, lineage: 'white-jade-rice'
  },
  'jiahe-rice-seed': { id: 'jiahe-rice-seed', name: '嘉禾灵稻种子', scientificName: 'Semen Jiahe', category: '粮食', waterReq: 0, sunReq: 0, fertReq: 0, description: '稀有的嘉禾灵稻种子。', educationalDescription: '稀有的嘉禾灵稻种子。', rewardText: '开启种植。', icon: '🧪', pattern: 'seed-pattern', basePrice: 2000, tier: 3, lineage: 'white-jade-rice' }
};

export const CROPS = PLANTS;

export type CreatureType = 'WATER' | 'SUN' | 'FIRE';

export type TileState = 'EMPTY' | 'PLANTED' | 'MATURE' | 'LOCKED' | 'TRANSFORMING';

export interface TileData {
  id: number;
  x: number;
  y: number;
  state: TileState;
  soilType: SoilType;
  cropType: PlantType | null;
  progress: number;
  hasCreature: boolean;
  creatureType?: CreatureType;
  lastSpawnedAt?: number;
  appliedElements?: {
    water: number;
    sun: number;
    fire: number;
  };
}

export interface LegacyTileState {
  id: number;
  x: number;
  y: number;
  soilType: SoilType;
  plantType: PlantType | null;
  growth: number;
  isLocked: boolean;
  hasCreature: boolean;
  creatureType?: CreatureType;
  lastSpawnedAt?: number;
  appliedElements?: {
    water: number;
    sun: number;
    fire: number;
  };
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

export type WeatherType = 'SUNNY' | 'RAINY' | 'STORMY' | 'WINDY';

export interface Particle {
  id: string;
  type: 'WATER' | 'EARTH' | 'LIGHT' | 'THUNDER';
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  isCollected?: boolean;
}

export interface Blueprint {
  id: string;
  name: string;
  requiredCrops: PlantType[];
  description: string;
  rewardKP: number;
}

export interface GameState {
  fp: number; 
  kp: number; 
  rp: number; 
  inventory: any[];
  relics: any[]; 
  grid: LegacyTileState[];
  weather: WeatherType;
  restorationProgress: number; 
}
