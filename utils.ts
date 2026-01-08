import { SeedType } from './types';

export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx"];
  const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
  
  if (suffixNum === 0) return Math.floor(num).toString();
  
  let shortValue = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
  if (shortValue % 1 !== 0) {
      shortValue = parseFloat(shortValue.toFixed(1));
  }
  return shortValue + suffixes[suffixNum];
};

export const generateRandomStock = (): Record<SeedType, number> => {
  const stock: Record<string, number> = {};
  Object.values(SeedType).forEach(t => stock[t] = 0);

  // Priority seeds: Always available to prevent softlocks
  const prioritySeeds = [SeedType.WHEAT, SeedType.LETTUCE];

  // Pool for random selection (excluding priority seeds)
  const pool = Object.values(SeedType).filter(t => !prioritySeeds.includes(t));
  
  // Select a random number of additional types (e.g., 4 to 7 types)
  const numberOfRandomSlots = Math.floor(Math.random() * 4) + 4; 

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedRandom = shuffled.slice(0, numberOfRandomSlots);
  
  const finalSelection = [...prioritySeeds, ...selectedRandom];

  finalSelection.forEach(type => {
    // Generate a bulk quantity between 10 and 30 seeds for each selected type
    stock[type] = Math.floor(Math.random() * 21) + 10;
  });

  return stock as Record<SeedType, number>;
};

export const calculateRebirthPotential = (coins: number, currentCost: number) => {
  if (coins < currentCost) return 0;
  return Math.floor(coins / currentCost);
};