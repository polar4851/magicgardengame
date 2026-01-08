export enum SeedType {
  WHEAT = 'WHEAT',
  LETTUCE = 'LETTUCE',
  CORN = 'CORN',
  POTATO = 'POTATO',
  TOMATO = 'TOMATO',
  EGGPLANT = 'EGGPLANT',
  CARROT = 'CARROT',
  ONION = 'ONION',
  PEPPER = 'PEPPER',
  PUMPKIN = 'PUMPKIN',
  WATERMELON = 'WATERMELON',
  STRAWBERRY = 'STRAWBERRY',
  GRAPES = 'GRAPES',
  BLUEBERRY = 'BLUEBERRY',
  PINEAPPLE = 'PINEAPPLE',
  ORCHID = 'ORCHID',
  GOLDEN_APPLE = 'GOLDEN_APPLE',
  STARFRUIT = 'STARFRUIT',
  DRAGONFRUIT = 'DRAGONFRUIT',
  GEMFRUIT = 'GEMFRUIT'
}

export enum UpgradeType {
  FERTILIZER = 'FERTILIZER', // Speed
  MARKETING = 'MARKETING', // Sell Value
  SCARECROW = 'SCARECROW', // Passive Buff (visual mostly + luck)
  TRACTOR = 'TRACTOR', // Efficiency
}

export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export interface SeedDef {
  id: SeedType;
  name: string;
  rarity: Rarity;
  baseCost: number;
  baseSell: number;
  growthTimeMs: number;
  color: string; // Tailwind class or hex
}

export interface UpgradeDef {
  id: UpgradeType;
  name: string;
  description: string;
  baseCost: number;
  multiplier: number; // Cost scaling
  effectValue: number; // What it adds (e.g. 0.1 speed)
  maxLevel: number;
}

export interface CellState {
  id: number;
  seedId: SeedType | null;
  plantedAt: number | null; // Timestamp
  isMature: boolean;
}

export interface GameState {
  coins: number;
  multiplier: number;
  rebirthCost: number;
  inventory: Record<SeedType, number>;
  upgrades: Record<UpgradeType, number>;
  grid: CellState[];
  shopStock: Record<SeedType, number>; 
  nextRestockTime: number; 
}