import { SeedDef, SeedType, Rarity, UpgradeDef, UpgradeType } from './types';

export const GRID_SIZE = 12; // Increased to 12x12 (144 cells)
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
export const SHOP_RESTOCK_INTERVAL_MS = 60000; 
export const TOTAL_SHOP_STOCK = 50; 
export const INITIAL_REBIRTH_COST = 50; 

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-stone-600',
  [Rarity.UNCOMMON]: 'text-green-600',
  [Rarity.RARE]: 'text-blue-600',
  [Rarity.EPIC]: 'text-purple-600',
  [Rarity.LEGENDARY]: 'text-yellow-600 animate-pulse',
};

// UPGRADES DEFINITION (TRANSLATED)
export const UPGRADES: Record<UpgradeType, UpgradeDef> = {
  [UpgradeType.FERTILIZER]: {
    id: UpgradeType.FERTILIZER,
    name: "Adubo Turbo",
    description: "Plantas crescem 10% mais rápido por nível.",
    baseCost: 200,
    multiplier: 2.5,
    effectValue: 0.10,
    maxLevel: 10
  },
  [UpgradeType.MARKETING]: {
    id: UpgradeType.MARKETING,
    name: "Feira da Cidade",
    description: "Venda colheitas por +20% de valor.",
    baseCost: 500,
    multiplier: 3.0,
    effectValue: 0.20,
    maxLevel: 20
  },
  [UpgradeType.SCARECROW]: {
    id: UpgradeType.SCARECROW,
    name: "Espantalho de Ouro",
    description: "Aumenta a sorte e decora a fazenda.",
    baseCost: 1000,
    multiplier: 2.0,
    effectValue: 1, 
    maxLevel: 5
  },
  [UpgradeType.TRACTOR]: {
    id: UpgradeType.TRACTOR,
    name: "Trator Velho",
    description: "Apenas para ostentação... por enquanto!",
    baseCost: 100000,
    multiplier: 5.0,
    effectValue: 0,
    maxLevel: 1
  }
};

// SEEDS (TRANSLATED)
export const SEEDS: Record<SeedType, SeedDef> = {
  // COMMON
  [SeedType.WHEAT]: { id: SeedType.WHEAT, name: 'Trigo', rarity: Rarity.COMMON, baseCost: 5, baseSell: 7, growthTimeMs: 2000, color: 'text-yellow-200' },
  [SeedType.LETTUCE]: { id: SeedType.LETTUCE, name: 'Alface', rarity: Rarity.COMMON, baseCost: 15, baseSell: 20, growthTimeMs: 3500, color: 'text-green-300' },
  [SeedType.CORN]: { id: SeedType.CORN, name: 'Milho', rarity: Rarity.COMMON, baseCost: 40, baseSell: 55, growthTimeMs: 5000, color: 'text-yellow-400' },
  [SeedType.POTATO]: { id: SeedType.POTATO, name: 'Batata', rarity: Rarity.COMMON, baseCost: 80, baseSell: 110, growthTimeMs: 8000, color: 'text-yellow-700' },
  
  // UNCOMMON
  [SeedType.TOMATO]: { id: SeedType.TOMATO, name: 'Tomate', rarity: Rarity.UNCOMMON, baseCost: 200, baseSell: 280, growthTimeMs: 10000, color: 'text-red-500' },
  [SeedType.EGGPLANT]: { id: SeedType.EGGPLANT, name: 'Berinjela', rarity: Rarity.UNCOMMON, baseCost: 450, baseSell: 600, growthTimeMs: 12000, color: 'text-purple-600' },
  [SeedType.CARROT]: { id: SeedType.CARROT, name: 'Cenoura', rarity: Rarity.UNCOMMON, baseCost: 700, baseSell: 950, growthTimeMs: 15000, color: 'text-orange-500' },
  [SeedType.ONION]: { id: SeedType.ONION, name: 'Cebola', rarity: Rarity.UNCOMMON, baseCost: 1200, baseSell: 1600, growthTimeMs: 18000, color: 'text-orange-200' },

  // RARE
  [SeedType.PEPPER]: { id: SeedType.PEPPER, name: 'Pimenta', rarity: Rarity.RARE, baseCost: 3000, baseSell: 4200, growthTimeMs: 22000, color: 'text-red-600' },
  [SeedType.PUMPKIN]: { id: SeedType.PUMPKIN, name: 'Abóbora', rarity: Rarity.RARE, baseCost: 6000, baseSell: 9000, growthTimeMs: 30000, color: 'text-orange-600' },
  [SeedType.WATERMELON]: { id: SeedType.WATERMELON, name: 'Melancia', rarity: Rarity.RARE, baseCost: 12000, baseSell: 18000, growthTimeMs: 35000, color: 'text-green-600' },
  [SeedType.STRAWBERRY]: { id: SeedType.STRAWBERRY, name: 'Morango', rarity: Rarity.RARE, baseCost: 25000, baseSell: 40000, growthTimeMs: 40000, color: 'text-pink-500' },

  // EPIC
  [SeedType.GRAPES]: { id: SeedType.GRAPES, name: 'Uvas', rarity: Rarity.EPIC, baseCost: 80000, baseSell: 130000, growthTimeMs: 45000, color: 'text-purple-500' },
  [SeedType.BLUEBERRY]: { id: SeedType.BLUEBERRY, name: 'Mirtilo', rarity: Rarity.EPIC, baseCost: 200000, baseSell: 320000, growthTimeMs: 50000, color: 'text-blue-600' },
  [SeedType.PINEAPPLE]: { id: SeedType.PINEAPPLE, name: 'Abacaxi', rarity: Rarity.EPIC, baseCost: 500000, baseSell: 850000, growthTimeMs: 60000, color: 'text-yellow-300' },
  [SeedType.ORCHID]: { id: SeedType.ORCHID, name: 'Orquídea', rarity: Rarity.EPIC, baseCost: 1000000, baseSell: 1800000, growthTimeMs: 75000, color: 'text-pink-300' },

  // LEGENDARY
  [SeedType.GOLDEN_APPLE]: { id: SeedType.GOLDEN_APPLE, name: 'Maçã Dourada', rarity: Rarity.LEGENDARY, baseCost: 5000000, baseSell: 12000000, growthTimeMs: 120000, color: 'text-yellow-200' },
  [SeedType.STARFRUIT]: { id: SeedType.STARFRUIT, name: 'Carambola', rarity: Rarity.LEGENDARY, baseCost: 25000000, baseSell: 60000000, growthTimeMs: 150000, color: 'text-lime-300' },
  [SeedType.DRAGONFRUIT]: { id: SeedType.DRAGONFRUIT, name: 'Pitaia', rarity: Rarity.LEGENDARY, baseCost: 100000000, baseSell: 250000000, growthTimeMs: 200000, color: 'text-pink-600' },
  [SeedType.GEMFRUIT]: { id: SeedType.GEMFRUIT, name: 'Fruta Gema', rarity: Rarity.LEGENDARY, baseCost: 1000000000, baseSell: 3000000000, growthTimeMs: 300000, color: 'text-cyan-300' },
};