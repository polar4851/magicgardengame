import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBasket, 
  RotateCcw, 
  Timer, 
  Coins, 
  TrendingUp,
  AlertTriangle,
  Star,
  Hammer,
  Cloud,
  Sun,
  Menu,
  Shovel,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { SeedType, CellState, Rarity, UpgradeType } from './types';
import { SEEDS, TOTAL_CELLS, SHOP_RESTOCK_INTERVAL_MS, INITIAL_REBIRTH_COST, GRID_SIZE, RARITY_COLORS, UPGRADES } from './constants';
import { formatNumber, generateRandomStock, calculateRebirthPotential } from './utils';

// --- SVGS & GRAPHICS ---

const Tree = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <rect x="42" y="60" width="16" height="40" fill="#78350f" />
    <path d="M42,60 L50,50 L58,60" fill="#78350f" />
    <circle cx="50" cy="40" r="35" fill="#15803d" />
    <circle cx="30" cy="50" r="20" fill="#166534" />
    <circle cx="70" cy="50" r="20" fill="#166534" />
    <circle cx="50" cy="20" r="20" fill="#22c55e" />
    <circle cx="55" cy="30" r="8" fill="#4ade80" opacity="0.3" />
    <circle cx="35" cy="45" r="5" fill="#4ade80" opacity="0.2" />
  </svg>
);

const Flower = ({ className, style, color = "#f472b6" }: { className?: string, style?: React.CSSProperties, color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <path d="M50,50 L50,90" stroke="#166534" strokeWidth="4" />
    <path d="M50,70 Q70,60 50,90" fill="#22c55e" />
    <circle cx="35" cy="35" r="15" fill={color} />
    <circle cx="65" cy="35" r="15" fill={color} />
    <circle cx="35" cy="65" r="15" fill={color} />
    <circle cx="65" cy="65" r="15" fill={color} />
    <circle cx="50" cy="50" r="12" fill="#fcd34d" />
  </svg>
);

const Barn = () => (
  <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl">
    <path d="M20,80 L100,20 L180,80 V180 H20 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
    <path d="M20,80 L100,20 L180,80" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <rect x="70" y="100" width="60" height="80" fill="#7f1d1d" stroke="white" strokeWidth="4" />
    <line x1="100" y1="100" x2="100" y2="180" stroke="white" strokeWidth="2" />
    <line x1="70" y1="100" x2="130" y2="180" stroke="#991b1b" strokeWidth="2" opacity="0.5" />
    <line x1="130" y1="100" x2="70" y2="180" stroke="#991b1b" strokeWidth="2" opacity="0.5" />
    <circle cx="100" cy="60" r="15" fill="#1e293b" stroke="white" strokeWidth="3" />
    <path d="M100,45 V75 M85,60 H115" stroke="white" strokeWidth="2" />
  </svg>
);

const DynamicFence = ({ gridSize }: { gridSize: number }) => {
  const postInterval = 100 / (gridSize / 2); 
  const posts = [];
  for(let i=0; i<=100; i+=postInterval) {
     posts.push(i);
  }

  return (
    <svg 
      viewBox="-4 -4 108 108" 
      preserveAspectRatio="none"
      className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-20 drop-shadow-xl overflow-visible"
    >
      <rect x="0" y="0" width="100" height="3" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
      <rect x="0" y="0" width="100" height="1.5" rx="1" fill="#b45309" /> 
      
      <rect x="0" y="97" width="100" height="3" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
      <rect x="0" y="97" width="100" height="1.5" rx="1" fill="#b45309" />

      <rect x="0" y="0" width="3" height="100" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
      <rect x="0" y="0" width="1.5" height="100" rx="1" fill="#b45309" />

      <rect x="97" y="0" width="3" height="100" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
      <rect x="97" y="0" width="1.5" height="100" rx="1" fill="#b45309" />

      {posts.map((pos, i) => (
        <React.Fragment key={`h-${i}`}>
           <g transform={`translate(${pos - 1.5}, -1.5)`}>
              <rect width="4" height="6" rx="1" fill="#78350f" />
              <rect x="0.5" y="0.5" width="3" height="4" rx="0.5" fill="#b45309" />
           </g>
           <g transform={`translate(${pos - 1.5}, 95.5)`}>
              <rect width="4" height="6" rx="1" fill="#78350f" />
              <rect x="0.5" y="0.5" width="3" height="4" rx="0.5" fill="#b45309" />
           </g>
        </React.Fragment>
      ))}

      {posts.filter(p => p > 5 && p < 95).map((pos, i) => (
        <React.Fragment key={`v-${i}`}>
           <g transform={`translate(-1.5, ${pos - 1.5})`}>
              <rect width="6" height="4" rx="1" fill="#78350f" />
              <rect x="0.5" y="0.5" width="4" height="3" rx="0.5" fill="#b45309" />
           </g>
           <g transform={`translate(95.5, ${pos - 1.5})`}>
              <rect width="6" height="4" rx="1" fill="#78350f" />
              <rect x="0.5" y="0.5" width="4" height="3" rx="0.5" fill="#b45309" />
           </g>
        </React.Fragment>
      ))}
    </svg>
  );
};

const AnimatedPenguin = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
         <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
         <feOffset dx="0" dy="4" result="offsetblur"/>
         <feComponentTransfer>
           <feFuncA type="linear" slope="0.3"/>
         </feComponentTransfer>
         <feMerge> 
           <feMergeNode/>
           <feMergeNode in="SourceGraphic"/> 
         </feMerge>
      </filter>
    </defs>
    
    <g className="animate-waddle">
      <g className="animate-breathe">
          {/* Main Body */}
          <path d="M25,90 Q20,95 30,95 L40,92 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <path d="M75,90 Q80,95 70,95 L60,92 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />

          {/* Body Shape */}
          <path d="M20,50 Q20,10 50,10 Q80,10 80,50 Q85,85 50,85 Q15,85 20,50 Z" 
                fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" filter="url(#shadow)" />
          
          {/* Belly */}
          <path d="M30,50 Q30,25 50,25 Q70,25 70,50 Q72,80 50,80 Q28,80 30,50 Z" 
                fill="white" />

          {/* Wings (Flippers) */}
          <g transform="translate(18, 45)">
            {/* Path starts at 0,0, which is the shoulder */}
            <path className="animate-flap-left" d="M0,0 Q-10,15 5,30 Q10,15 0,0" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
          </g>
          <g transform="translate(82, 45)">
             {/* Path starts at 0,0, which is the shoulder */}
            <path className="animate-flap-right" d="M0,0 Q10,15 -5,30 Q-10,15 0,0" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
          </g>

          {/* Face */}
          <g transform="translate(0, 0)">
              {/* Eyes - Grouped to animate together */}
              <g className="animate-blink">
                  <ellipse cx="40" cy="35" rx="4" ry="5" fill="#1c1917" />
                  <ellipse cx="60" cy="35" rx="4" ry="5" fill="#1c1917" />
                  <circle cx="41" cy="33" r="1.5" fill="white" />
                  <circle cx="61" cy="33" r="1.5" fill="white" />
              </g>

              {/* Beak */}
              <path d="M45,40 L55,40 L50,48 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
              <path d="M45,40 Q50,38 55,40" fill="#fbbf24" opacity="0.5" />

              {/* Blush */}
              <ellipse cx="32" cy="42" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
              <ellipse cx="68" cy="42" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
          </g>
      </g>
    </g>
  </svg>
);

const CropGraphic = ({ type, progress, isMature }: { type: SeedType, progress: number, isMature: boolean }) => {
  const scale = isMature ? 1 : 0.3 + (progress / 100) * 0.7;
  const bounce = isMature ? "animate-bounce" : "";
  
  const renderCrop = () => {
    switch(type) {
      case SeedType.LETTUCE:
        return (
          <g>
             {/* Ruffled leaves */}
             <circle cx="12" cy="14" r="8" fill="#4ade80" stroke="#166534" strokeWidth="1" />
             <path d="M12 14 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" fill="#86efac" opacity="0.7" />
             <path d="M8 10 Q12 18 16 10" stroke="#166534" strokeWidth="0.5" fill="none" />
             <path d="M6 14 Q12 20 18 14" stroke="#166534" strokeWidth="0.5" fill="none" />
          </g>
        );
      case SeedType.WHEAT:
        return (
          <g>
            <path d="M12 22 L12 4" stroke="#eab308" strokeWidth="2" />
            <ellipse cx="12" cy="6" rx="3" ry="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <ellipse cx="10" cy="10" rx="3" ry="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" transform="rotate(-20 10 10)" />
            <ellipse cx="14" cy="10" rx="3" ry="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" transform="rotate(20 14 10)" />
          </g>
        );
      case SeedType.CORN:
         return (
           <g>
             <rect x="10" y="4" width="4" height="16" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1" />
             {/* Husks */}
             <path d="M10 20 Q4 10 10 8" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
             <path d="M14 20 Q20 10 14 8" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
             {/* Kernels pattern */}
             <circle cx="12" cy="6" r="0.5" fill="#a16207" />
             <circle cx="12" cy="10" r="0.5" fill="#a16207" />
             <circle cx="12" cy="14" r="0.5" fill="#a16207" />
           </g>
         );
      case SeedType.CARROT:
        return (
          <g>
            {/* Tops */}
            <path d="M12 10 L8 2 M12 10 L12 1 M12 10 L16 2" stroke="#22c55e" strokeWidth="2" />
            {/* Body */}
            <path d="M8 10 Q12 10 16 10 L12 22 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            <path d="M9 12 H15 M10 15 H14 M11 18 H13" stroke="#7c2d12" strokeWidth="0.5" opacity="0.5" />
          </g>
        );
      case SeedType.TOMATO:
        return (
           <g>
              <circle cx="12" cy="14" r="6" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <path d="M12 8 L12 5" stroke="#166534" strokeWidth="2" />
              <path d="M12 8 L9 10 M12 8 L15 10 M12 8 L12 11" stroke="#166534" strokeWidth="1" />
              <circle cx="14" cy="12" r="1.5" fill="white" opacity="0.4" />
           </g>
        );
       case SeedType.POTATO:
          return (
             <g>
               <ellipse cx="12" cy="15" rx="6" ry="5" fill="#d4a373" stroke="#78350f" strokeWidth="1" />
               <circle cx="10" cy="14" r="0.5" fill="#78350f" opacity="0.5" />
               <circle cx="14" cy="16" r="0.5" fill="#78350f" opacity="0.5" />
               <path d="M12 15 L12 5 M12 10 L9 6 M12 8 L15 6" stroke="#166534" strokeWidth="1" opacity={isMature ? 1 : 0.5} />
             </g>
          );
      default:
        return (
          <g>
             <circle cx="12" cy="14" r="6" className={SEEDS[type].color.replace('text-', 'fill-')} stroke="currentColor" strokeWidth="1" />
             <path d="M12 8 L12 4" stroke="#15803d" strokeWidth="2" />
             <path d="M12 8 L9 6 M12 8 L15 6" stroke="#22c55e" strokeWidth="1" />
          </g>
        )
    }
  }

  return (
    <div 
      className={`w-full h-full flex items-center justify-center transition-transform duration-500 origin-bottom ${bounce} overflow-visible`}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="w-[100%] h-[100%] pb-2 drop-shadow-md">
        <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
           {renderCrop()}
        </svg>
      </div>
    </div>
  );
}

// --- GAME COMPONENTS ---

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'earn' | 'info';
}

const NotificationContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
    {toasts.map(t => (
      <div 
        key={t.id}
        className={`
          px-4 py-2 rounded-full font-bold shadow-lg animate-fade-up flex items-center gap-2
          ${t.type === 'earn' ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-200' : ''}
          ${t.type === 'success' ? 'bg-green-500 text-white border-2 border-green-400' : ''}
          ${t.type === 'info' ? 'bg-blue-500 text-white border-2 border-blue-400' : ''}
        `}
      >
        {t.type === 'earn' && <Coins size={16} />}
        {t.type === 'success' && <Sprout size={16} />}
        {t.message}
      </div>
    ))}
  </div>
);

const MinecraftHUD = ({ 
  inventory, 
  selectedSeed, 
  onSelect 
}: { 
  inventory: Record<SeedType, number>, 
  selectedSeed: SeedType | null, 
  onSelect: (s: SeedType) => void 
}) => {
  const ownedSeeds = Object.values(SEEDS).filter(s => inventory[s.id] > 0 || s.id === selectedSeed);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1c1917] p-2 rounded-xl border-4 border-[#44403c] shadow-2xl flex gap-2 overflow-x-auto max-w-[90vw] custom-scrollbar">
       {ownedSeeds.length === 0 && (
         <div className="text-stone-400 font-bold px-4 py-2">Compre sementes na loja! 👉</div>
       )}
       {ownedSeeds.map((seed, idx) => {
         const count = inventory[seed.id];
         const isSelected = selectedSeed === seed.id;
         return (
           <div 
             key={seed.id}
             onClick={() => onSelect(seed.id)}
             className={`
               relative w-14 h-14 md:w-16 md:h-16 shrink-0 bg-[#292524] rounded-lg cursor-pointer transition-all
               border-4 
               ${isSelected ? 'border-yellow-400 scale-110 z-10' : 'border-[#57534e] hover:border-stone-400'}
             `}
           >
              <div className="absolute top-0 left-1 text-[10px] text-stone-500 font-bold">{idx + 1}</div>
              <div className="w-full h-full p-2 flex items-center justify-center">
                 <CropGraphic type={seed.id} progress={100} isMature={true} />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#0c0a09] text-white text-xs font-bold px-1.5 py-0.5 rounded-tl-md border-l border-t border-[#57534e]">
                 {formatNumber(count)}
              </div>
           </div>
         );
       })}
    </div>
  );
};

interface CellProps {
  cell: CellState;
  selectedSeed: SeedType | null;
  onInteract: (id: number) => void;
  speedMultiplier: number;
  isFocused: boolean;
}

const Cell: React.FC<CellProps> = ({ 
  cell, 
  selectedSeed, 
  onInteract,
  speedMultiplier,
  isFocused
}) => {
  const seedDef = cell.seedId ? SEEDS[cell.seedId] : null;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!cell.seedId || !cell.plantedAt || cell.isMature || !seedDef) {
      setProgress(cell.isMature ? 100 : 0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - (cell.plantedAt || now);
      const adjustedGrowthTime = seedDef.growthTimeMs / speedMultiplier;
      const pct = Math.min((elapsed / adjustedGrowthTime) * 100, 100);
      setProgress(pct);
    }, 100);

    return () => clearInterval(interval);
  }, [cell.seedId, cell.plantedAt, cell.isMature, seedDef, speedMultiplier]);

  return (
    <div 
      onClick={() => onInteract(cell.id)}
      className={`
        relative cursor-pointer transition-all duration-100 group
        overflow-visible
        hover:brightness-110
        ${isFocused ? 'brightness-125 z-10' : ''}
      `}
      style={{
        backgroundColor: '#5d4037', 
        backgroundImage: `
          radial-gradient(circle at 30% 30%, #6d4c41 2px, transparent 2.5px),
          radial-gradient(circle at 70% 70%, #6d4c41 2px, transparent 2.5px),
          linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2))
        `,
        backgroundSize: '16px 16px, 100% 100%',
        boxShadow: isFocused 
          ? 'inset 0 0 0 2px rgba(255,255,255,0.8), inset 0 0 15px rgba(255,255,255,0.3)' 
          : 'inset 0 0 8px rgba(0,0,0,0.4)',
        border: isFocused ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.05)'
      }}
    >
      {!cell.seedId && selectedSeed && (
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity bg-white/10 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
           <Shovel size={16} className={`text-white/60 ${isFocused ? 'animate-pulse' : 'animate-bounce'}`} />
        </div>
      )}

      {cell.seedId && seedDef && (
        <div className="absolute -inset-2 -top-4 z-10 flex flex-col justify-end items-center pointer-events-none">
          <CropGraphic type={cell.seedId} progress={progress} isMature={cell.isMature} />
        </div>
      )}

      {cell.seedId && !cell.isMature && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/40 rounded-full overflow-hidden z-20">
          <div 
            className="h-full bg-green-500 transition-all duration-100 ease-linear shadow-[0_0_4px_rgba(34,197,94,0.8)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {cell.isMature && (
         <div className="absolute -top-4 -right-2 z-30 animate-bounce drop-shadow-lg">
            <Coins size={16} className="text-yellow-400 fill-yellow-400 stroke-yellow-700" />
         </div>
      )}
    </div>
  );
};

export default function App() {
  const [coins, setCoins] = useState(20);
  const [multiplier, setMultiplier] = useState(1);
  const [rebirthCost, setRebirthCost] = useState(INITIAL_REBIRTH_COST);
  const [playerPos, setPlayerPos] = useState(0); 
  const [activeTab, setActiveTab] = useState<'shop' | 'upgrades'>('shop');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const initialInventory: Record<string, number> = {};
  Object.values(SeedType).forEach(t => initialInventory[t] = 0);
  const [inventory, setInventory] = useState<Record<SeedType, number>>(initialInventory as Record<SeedType, number>);
  
  const [shopStock, setShopStock] = useState<Record<SeedType, number>>(generateRandomStock());

  const initialUpgrades: Record<string, number> = {};
  Object.values(UpgradeType).forEach(t => initialUpgrades[t] = 0);
  const [upgrades, setUpgrades] = useState<Record<UpgradeType, number>>(initialUpgrades as Record<UpgradeType, number>);
  
  const [grid, setGrid] = useState<CellState[]>(
    Array.from({ length: TOTAL_CELLS }, (_, i) => ({
      id: i,
      seedId: null,
      plantedAt: null,
      isMature: false,
    }))
  );

  const [selectedSeed, setSelectedSeed] = useState<SeedType | null>(SeedType.WHEAT);
  const [nextRestockTime, setNextRestockTime] = useState(Date.now() + SHOP_RESTOCK_INTERVAL_MS);
  const [timeLeft, setTimeLeft] = useState(60);

  const marketingLvl = upgrades[UpgradeType.MARKETING] || 0;
  const fertilizerLvl = upgrades[UpgradeType.FERTILIZER] || 0;
  const marketingBonus = 1 + (marketingLvl * UPGRADES[UpgradeType.MARKETING].effectValue);
  const growthSpeedBonus = 1 + (fertilizerLvl * UPGRADES[UpgradeType.FERTILIZER].effectValue);

  const addToast = (msg: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.ceil((nextRestockTime - now) / 1000);
      if (diff <= 0) {
        setShopStock(generateRandomStock());
        setNextRestockTime(now + SHOP_RESTOCK_INTERVAL_MS);
        setTimeLeft(60);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRestockTime]);

  useEffect(() => {
    const checker = setInterval(() => {
      setGrid(prevGrid => prevGrid.map(cell => {
        if (!cell.seedId || !cell.plantedAt || cell.isMature) return cell;
        const seedDef = SEEDS[cell.seedId];
        const now = Date.now();
        const adjustedGrowthTime = seedDef.growthTimeMs / growthSpeedBonus;
        if (now - cell.plantedAt >= adjustedGrowthTime) {
          return { ...cell, isMature: true };
        }
        return cell;
      }));
    }, 200); 
    return () => clearInterval(checker);
  }, [growthSpeedBonus]);

  const handleBuy = (type: SeedType) => {
    const seed = SEEDS[type];
    const stock = shopStock[type];
    if (coins >= seed.baseCost && stock > 0) {
      setCoins(prev => prev - seed.baseCost);
      setInventory(prev => ({ ...prev, [type]: prev[type] + 1 }));
      setShopStock(prev => ({ ...prev, [type]: prev[type] - 1 }));
      if (inventory[type] === 0 && !selectedSeed) {
         setSelectedSeed(type);
      }
    }
  };

  const handleBuyUpgrade = (type: UpgradeType) => {
    const def = UPGRADES[type];
    const currentLvl = upgrades[type] || 0;
    const cost = Math.floor(def.baseCost * Math.pow(def.multiplier, currentLvl));
    if (coins >= cost && currentLvl < def.maxLevel) {
      setCoins(prev => prev - cost);
      setUpgrades(prev => ({ ...prev, [type]: currentLvl + 1 }));
      addToast(`${def.name} melhorado!`, 'success');
    }
  };

  // Wrap handleCellInteract in useCallback to be safe for dependency arrays
  const handleCellInteract = useCallback((cellId: number) => {
    setPlayerPos(cellId);
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const cell = newGrid[cellId];
      if (cell.isMature && cell.seedId) {
        const seedDef = SEEDS[cell.seedId];
        const profit = Math.floor(seedDef.baseSell * multiplier * marketingBonus);
        setCoins(prev => prev + profit);
        addToast(`+${formatNumber(profit)} moedas!`, 'earn');
        newGrid[cellId] = { ...cell, seedId: null, plantedAt: null, isMature: false };
        return newGrid;
      }
      return newGrid;
    });

    // Check conditions using current state refs would be ideal, but for now we rely on closure state
    // Note: We need to use functional updates for inventory to ensure we use latest
    // But reading inventory in the 'if' condition requires dependency on 'inventory'.
    
    // To solve the "accessing inventory inside setGrid" issue, we do a two-step check or pass logic.
    // Simplifying for this structure:
    setInventory(prevInv => {
       const cell = grid[cellId]; // Warning: This 'grid' is from closure, might be stale if not carefully managed? 
       // Actually 'grid' is a dependency of useCallback, so it refreshes.
       
       if (!cell.seedId && selectedSeed && prevInv[selectedSeed] > 0) {
          // Update Grid inside this effect? No, bad pattern. 
          // We must trigger grid update separately or here.
          // Let's keep the logic clean:
          return prevInv;
       }
       return prevInv;
    });

    // Re-implementing logic to be closure-safe
    const cell = grid[cellId];
    if (!cell.seedId && selectedSeed) {
        if (inventory[selectedSeed] > 0) {
            setInventory(prev => ({ ...prev, [selectedSeed]: prev[selectedSeed] - 1 }));
            setGrid(prev => {
                const g = [...prev];
                g[cellId] = { ...g[cellId], seedId: selectedSeed, plantedAt: Date.now(), isMature: false };
                return g;
            });
            addToast(`Plantou ${SEEDS[selectedSeed].name}`, 'success');
        } else {
             addToast(`Sem sementes de ${SEEDS[selectedSeed].name}!`, 'info');
        }
    }
  }, [grid, inventory, selectedSeed, multiplier, marketingBonus]);

  const handleRebirth = () => {
    const buyableAmount = calculateRebirthPotential(coins, rebirthCost);
    if (buyableAmount > 0) {
      setMultiplier(prev => prev + buyableAmount);
      setRebirthCost(prev => Math.floor(prev + (0.5 * buyableAmount)));
      setCoins(0);
      Object.values(SeedType).forEach(t => inventory[t] = 0);
      setInventory({...inventory});
      Object.values(UpgradeType).forEach(t => upgrades[t] = 0);
      setUpgrades({...upgrades});
      setGrid(prev => prev.map(c => ({ ...c, seedId: null, plantedAt: null, isMature: false })));
      setInventory(prev => ({...prev, [SeedType.WHEAT]: 1}));
      setPlayerPos(0);
      addToast("RENASCIMENTO CONCLUÍDO!", 'success');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for navigation keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Seed Selection (1-9)
      const key = parseInt(e.key);
      if (key >= 1 && key <= 9) {
        const ownedSeeds = Object.values(SEEDS).filter(s => inventory[s.id] > 0 || s.id === selectedSeed);
        if (ownedSeeds[key - 1]) {
           setSelectedSeed(ownedSeeds[key - 1].id);
        }
        return;
      }

      // Movement (WASD + Arrows)
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
          setPlayerPos(prev => {
              let next = prev;
              const k = e.key.toLowerCase();
              
              // Up
              if (k === 'w' || k === 'arrowup') {
                  if (prev >= GRID_SIZE) next = prev - GRID_SIZE;
              } 
              // Down
              else if (k === 's' || k === 'arrowdown') {
                  if (prev < TOTAL_CELLS - GRID_SIZE) next = prev + GRID_SIZE;
              } 
              // Left
              else if (k === 'a' || k === 'arrowleft') {
                  if (prev % GRID_SIZE !== 0) next = prev - 1;
              } 
              // Right
              else if (k === 'd' || k === 'arrowright') {
                  if ((prev + 1) % GRID_SIZE !== 0) next = prev + 1;
              }
              return next;
          });
          return;
      }

      // Interaction (Space or Enter)
      if (e.key === ' ' || e.key === 'Enter') {
          handleCellInteract(playerPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inventory, selectedSeed, playerPos, handleCellInteract]);

  const potentialRebirths = calculateRebirthPotential(coins, rebirthCost);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-blue-300 overflow-hidden font-sans selection:bg-yellow-300 selection:text-yellow-900">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200">
         <div className="absolute top-8 right-8 text-yellow-300 animate-spin-slow" style={{animationDuration: '80s'}}>
            <Sun size={140} fill="currentColor" strokeWidth={1} />
         </div>
         <Cloud className="absolute top-20 left-10 text-white opacity-80 w-32 h-20 animate-pulse" style={{animationDuration: '10s'}} fill="white" />
         <Cloud className="absolute top-10 right-1/3 text-white opacity-60 w-24 h-16" fill="white" />
         <div className="absolute bottom-1/2 left-0 w-full h-64 flex items-end opacity-40">
             <div className="w-1/3 h-full bg-indigo-300 transform scale-150 translate-y-10 rotate-45 rounded-xl"></div>
             <div className="w-1/2 h-4/5 bg-indigo-400 transform scale-125 translate-y-10 -rotate-12 rounded-3xl mx-[-10%]"></div>
         </div>
         <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-green-500 to-green-400" style={{ clipPath: 'ellipse(150% 100% at 50% 100%)' }}></div>
         <div className="absolute bottom-0 w-full h-[55%] bg-gradient-to-t from-lime-500 to-lime-400" style={{ clipPath: 'ellipse(120% 100% at 50% 100%)' }}></div>
         <div className="absolute bottom-0 left-0 w-full h-full opacity-80" style={{ background: 'radial-gradient(circle at 10% 90%, #38bdf8 0%, #38bdf8 15%, transparent 16%)'}}></div>
         <Tree className="absolute bottom-[30%] left-[5%] w-24 h-32 md:w-40 md:h-52 z-0 drop-shadow-xl" />
         <Tree className="absolute bottom-[25%] right-[10%] w-20 h-28 md:w-32 md:h-44 z-0 drop-shadow-xl" />
         <div className="absolute bottom-[48%] left-1/2 -translate-x-1/2 w-48 h-40 md:w-64 md:h-52 z-0 transform -translate-y-4"><Barn /></div>
         <Flower className="absolute bottom-10 left-20 w-8 h-8 animate-bounce" style={{animationDuration: '3s'}} color="#f472b6" />
         <Flower className="absolute bottom-5 left-1/3 w-10 h-10 animate-bounce" style={{animationDuration: '5s'}} color="#a78bfa" />
      </div>

      <aside className="w-full md:w-64 bg-white/90 backdrop-blur-md border-r-4 border-amber-200 p-4 flex flex-col gap-4 shrink-0 z-30 shadow-2xl rounded-r-3xl my-4 ml-2 h-[calc(100vh-2rem)]">
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="bg-amber-100 p-2 rounded-xl shadow-inner border border-amber-300">
             <Menu className="text-amber-700" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-green-700 tracking-tighter leading-none">Fazenda</h1>
            <h1 className="text-lg font-bold text-amber-600 tracking-widest leading-none uppercase">Feliz</h1>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-200 shadow-inner">
            <div className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1 ml-1">Caixa</div>
            <div className="flex items-center gap-2 text-amber-700 bg-white p-2 rounded-2xl border border-amber-100 shadow-sm">
              <div className="bg-yellow-400 p-1.5 rounded-full text-white shadow-sm"><Coins size={16} fill="currentColor" strokeWidth={2.5} /></div>
              <span className="text-2xl font-black tracking-tight">{formatNumber(coins)}</span>
            </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-3xl border-2 border-purple-200 shadow-inner">
            <div className="text-purple-500 text-xs font-black uppercase tracking-widest mb-1 ml-1">Multiplicador</div>
            <div className="flex items-center gap-2 text-purple-700 bg-white p-2 rounded-2xl border border-purple-100 shadow-sm">
               <div className="bg-purple-400 p-1.5 rounded-full text-white shadow-sm"><TrendingUp size={16} /></div>
              <span className="text-2xl font-black">x{formatNumber(multiplier)}</span>
            </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleRebirth}
            disabled={potentialRebirths < 1}
            className={`
              w-full py-4 px-4 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all border-b-8 active:border-b-0 active:translate-y-2 relative overflow-hidden group
              ${potentialRebirths >= 1 
                ? 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400' 
                : 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'}
            `}
          >
            <div className="flex items-center gap-2 font-black text-xl z-10">
              <RotateCcw size={20} strokeWidth={3} />
              {potentialRebirths > 0 ? `+${formatNumber(potentialRebirths)}` : "RENASCER"}
            </div>
            <div className="text-xs font-bold opacity-80 z-10">Custo: {formatNumber(rebirthCost)}</div>
          </button>
        </div>
      </aside>

      <main className="flex-1 relative flex items-center justify-center p-0 md:p-4 z-10 overflow-hidden">
        
        <div 
          className="relative z-10"
          style={{
             width: 'min(90vw, 85vh)',
             height: 'min(90vw, 85vh)',
          }}
        >
          <DynamicFence gridSize={GRID_SIZE} />
          <div className="absolute inset-0 bg-[#4d7c0f] rounded-xl shadow-2xl border-4 border-[#3f6212] z-0"></div>
          
          <div className="absolute inset-4 bg-[#5d4037] p-1 rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-30">
              <div 
                className="relative w-full h-full grid gap-0 border border-[#4e342e]"
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                }}
              >
                {grid.map(cell => (
                  <Cell 
                    key={cell.id} 
                    cell={cell} 
                    selectedSeed={selectedSeed}
                    onInteract={handleCellInteract}
                    speedMultiplier={growthSpeedBonus}
                    isFocused={playerPos === cell.id}
                  />
                ))}
                
                {/* Player Character */}
                <div 
                  className="absolute z-40 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-visible"
                  style={{
                    top: `${(Math.floor(playerPos / GRID_SIZE) / GRID_SIZE) * 100}%`,
                    left: `${((playerPos % GRID_SIZE) / GRID_SIZE) * 100}%`,
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center -mt-[60%] scale-[2.2] overflow-visible animate-bounce" style={{animationDuration: '0.4s', animationIterationCount: 1}}> 
                    <AnimatedPenguin />
                  </div>
                </div>
              </div>
          </div>
        </div>
        
        <NotificationContainer toasts={toasts} />
        <MinecraftHUD inventory={inventory} selectedSeed={selectedSeed} onSelect={setSelectedSeed} />

        {coins === 0 && Object.values(inventory).every(v => v === 0) && grid.every(c => !c.seedId) && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-8 py-6 rounded-3xl flex flex-col items-center gap-4 animate-bounce shadow-2xl border-8 border-white z-50">
                <AlertTriangle size={48} />
                <div className="text-center">
                   <h2 className="text-2xl font-black">OH NÃO!</h2>
                   <p className="font-bold">Você faliu!</p>
                </div>
                <button onClick={handleRebirth} className="bg-white text-red-500 font-black px-6 py-2 rounded-full hover:scale-110 transition-transform">
                  RENASCER (GRÁTIS)
                </button>
             </div>
        )}
      </main>

      <aside className="w-full md:w-80 bg-white/90 backdrop-blur-md border-l-4 border-green-200 flex flex-col shrink-0 z-30 shadow-2xl rounded-l-3xl my-4 mr-2 h-[calc(100vh-2rem)]">
        
        <div className="flex p-3 gap-3 bg-green-50 rounded-tl-3xl border-b border-green-100">
           <button 
             onClick={() => setActiveTab('shop')}
             className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-sm
               ${activeTab === 'shop' 
                 ? 'bg-white text-green-600 ring-2 ring-green-400 translate-y-0' 
                 : 'bg-green-100/50 text-green-800/60 hover:bg-white/60'}
             `}
           >
             <ShoppingBasket size={18} /> LOJA
           </button>
           <button 
             onClick={() => setActiveTab('upgrades')}
             className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-sm
               ${activeTab === 'upgrades' 
                 ? 'bg-white text-blue-600 ring-2 ring-blue-400 translate-y-0' 
                 : 'bg-blue-100/50 text-blue-800/60 hover:bg-white/60'}
             `}
           >
             <Hammer size={18} /> MELHORIAS
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50 rounded-bl-3xl">
          
          {activeTab === 'shop' && (
            <>
              {Object.values(SEEDS).map((seed) => {
                const stock = shopStock[seed.id];
                const owned = inventory[seed.id];
                const rarityColor = RARITY_COLORS[seed.rarity];

                return (
                  <div 
                    key={seed.id}
                    className="relative overflow-hidden rounded-2xl border-b-4 border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="p-3 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 shadow-inner border border-slate-200">
                          <div className="w-8 h-8"><CropGraphic type={seed.id} progress={100} isMature={true} /></div>
                        </div>
                        <div>
                          <div className={`font-black text-sm ${rarityColor} flex items-center gap-1 uppercase tracking-tight`}>
                            {seed.name}
                            {seed.rarity === Rarity.LEGENDARY && <Star size={12} fill="currentColor" className="animate-spin-slow" />}
                          </div>
                          <div className="text-xs text-slate-400 font-bold mt-1">
                             POSSUI: <span className="text-slate-700 text-sm">{formatNumber(owned)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuy(seed.id)}
                        disabled={coins < seed.baseCost || stock === 0}
                        className={`
                          px-3 py-2 rounded-xl text-sm font-bold flex flex-col items-end min-w-[70px] transition-all
                          active:scale-95
                          ${coins >= seed.baseCost && stock > 0 
                            ? 'bg-green-500 hover:bg-green-400 text-white shadow-green-200 shadow-lg' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <Coins size={14} fill="currentColor" className="text-yellow-300" />
                          <span>{formatNumber(seed.baseCost)}</span>
                        </div>
                      </button>
                    </div>
                    
                    <div className="bg-slate-50 px-3 py-1 flex items-center justify-between text-[10px] font-bold border-t border-slate-100">
                      <div className="text-slate-400 uppercase tracking-wider">
                        Estoque: <span className={stock > 0 ? "text-slate-600" : "text-red-500"}>{stock}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-between shadow-sm mt-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wide">
                  <Timer size={16} className={timeLeft < 10 ? "text-red-500 animate-pulse" : ""} />
                  Nova Loja Em
                </div>
                <div className={`font-black text-xl ${timeLeft < 10 ? "text-red-500" : "text-slate-700"}`}>{timeLeft}s</div>
              </div>
            </>
          )}

          {activeTab === 'upgrades' && (
             <div className="space-y-4">
               {Object.values(UPGRADES).map(upg => {
                 const currentLvl = upgrades[upg.id] || 0;
                 const cost = Math.floor(upg.baseCost * Math.pow(upg.multiplier, currentLvl));
                 const isMaxed = currentLvl >= upg.maxLevel;

                 return (
                   <div key={upg.id} className="bg-white rounded-2xl border-b-4 border-slate-200 p-4 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-black text-blue-900 text-sm uppercase tracking-wide">{upg.name}</h3>
                          <p className="text-xs text-blue-400 font-semibold mt-1 leading-tight max-w-[150px]">{upg.description}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-100">
                          LVL {currentLvl}/{upg.maxLevel}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleBuyUpgrade(upg.id)}
                        disabled={isMaxed || coins < cost}
                        className={`
                          w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95
                          ${isMaxed 
                             ? 'bg-green-100 text-green-700 border border-green-200'
                             : (coins >= cost 
                                ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-blue-200 shadow-lg' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                          }
                        `}
                      >
                        {isMaxed ? "MÁXIMO" : <><Coins size={14} className="text-yellow-300" fill="currentColor" /> {formatNumber(cost)}</>}
                      </button>
                   </div>
                 )
               })}
             </div>
          )}

        </div>
      </aside>
    </div>
  );
}