'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Rank type mirroring the Prisma Rank enum
 * Represents the divine hierarchy of OlympusBet
 */
export type Rank = 'MORTAL' | 'HOPLITE' | 'HERO' | 'DEMIGOD' | 'OLYMPIAN';

/**
 * Ambrosia thresholds for each rank in the Odyssey leveling system.
 * Named after the divine food of the gods that grants immortality.
 * 
 * - MORTAL: 0 - Starting rank, mere humans beginning their journey
 * - HOPLITE: 1,000 - Greek foot soldiers, proven warriors
 * - HERO: 10,000 - Legendary figures like Achilles and Odysseus
 * - DEMIGOD: 100,000 - Half-divine beings like Hercules and Perseus
 * - OLYMPIAN: 1,000,000 - Full god status, dwelling on Mount Olympus
 */
const AMBROSIA_THRESHOLDS: Record<Rank, number> = {
  MORTAL: 0,
  HOPLITE: 1000,
  HERO: 10000,
  DEMIGOD: 100000,
  OLYMPIAN: 1000000,
};

/**
 * Display names for each rank with Greek aesthetic
 */
const RANK_DISPLAY_NAMES: Record<Rank, string> = {
  MORTAL: 'Mortal',
  HOPLITE: 'Hoplite',
  HERO: 'Hero',
  DEMIGOD: 'Demigod',
  OLYMPIAN: 'Olympian',
};

/**
 * Rank icons (emoji representations for the MVP)
 */
const RANK_ICONS: Record<Rank, string> = {
  MORTAL: '🏛️',
  HOPLITE: '⚔️',
  HERO: '🛡️',
  DEMIGOD: '⚡',
  OLYMPIAN: '👑',
};

interface OdysseyProgressBarProps {
  /** Current Ambrosia (XP) amount */
  currentAmbrosia: number;
  /** Current rank of the user */
  currentRank: Rank;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether to show the detailed breakdown */
  showDetails?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
}

/**
 * Get the next rank in the progression
 */
const getNextRank = (currentRank: Rank): Rank | null => {
  const rankOrder: Rank[] = ['MORTAL', 'HOPLITE', 'HERO', 'DEMIGOD', 'OLYMPIAN'];
  const currentIndex = rankOrder.indexOf(currentRank);
  if (currentIndex < rankOrder.length - 1) {
    return rankOrder[currentIndex + 1];
  }
  return null;
};

/**
 * Calculate progress percentage to next rank
 */
const calculateProgress = (currentAmbrosia: number, currentRank: Rank): number => {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return 100; // Max rank reached
  
  const currentThreshold = AMBROSIA_THRESHOLDS[currentRank];
  const nextThreshold = AMBROSIA_THRESHOLDS[nextRank];
  const progressRange = nextThreshold - currentThreshold;
  const currentProgress = currentAmbrosia - currentThreshold;
  
  return Math.min(100, Math.max(0, (currentProgress / progressRange) * 100));
};

/**
 * Format large numbers with K, M suffixes
 */
const formatAmbrosia = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};

/**
 * OdysseyProgressBar - A Greek pillar that fills with golden liquid
 * 
 * This component represents the user's journey through the divine hierarchy
 * of OlympusBet. As users earn Ambrosia (XP) through wagering, the golden
 * liquid rises within a Greek Doric column, symbolizing their ascent to Olympus.
 * 
 * Design Philosophy:
 * - The pillar represents the connection between mortals and gods
 * - Golden liquid symbolizes Ambrosia, the food of the gods
 * - The rising animation represents the soul's journey to divinity
 * 
 * @example
 * ```tsx
 * <OdysseyProgressBar
 *   currentAmbrosia={5000}
 *   currentRank="HOPLITE"
 *   showDetails={true}
 * />
 * ```
 */
export const OdysseyProgressBar: React.FC<OdysseyProgressBarProps> = ({
  currentAmbrosia,
  currentRank,
  className,
  showDetails = true,
  animationDuration = 1.5,
}) => {
  const progress = calculateProgress(currentAmbrosia, currentRank);
  const nextRank = getNextRank(currentRank);
  const nextThreshold = nextRank ? AMBROSIA_THRESHOLDS[nextRank] : currentAmbrosia;
  const ambrosiaToNext = Math.max(0, nextThreshold - currentAmbrosia);

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Rank Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{RANK_ICONS[currentRank]}</span>
          <div>
            <h3 className="text-lg font-cinzel font-bold text-[#ffd700]">
              {RANK_DISPLAY_NAMES[currentRank]}
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Current Rank
            </p>
          </div>
        </div>
        {nextRank && (
          <div className="flex items-center gap-2 text-right">
            <div>
              <h3 className="text-lg font-cinzel font-bold text-slate-300">
                {RANK_DISPLAY_NAMES[nextRank]}
              </h3>
              <p className="text-xs text-slate-400 font-inter">
                Next Rank
              </p>
            </div>
            <span className="text-2xl opacity-50">{RANK_ICONS[nextRank]}</span>
          </div>
        )}
      </div>

      {/* Greek Pillar Progress Container */}
      <div className="relative">
        {/* Pillar Structure */}
        <div className="relative h-48 mx-auto" style={{ width: '80px' }}>
          {/* Capital (Top) - Doric style */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6">
            <div className="w-full h-2 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] rounded-t-sm shadow-md" />
            <div className="w-[90%] mx-auto h-2 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]" />
            <div className="w-[85%] mx-auto h-2 bg-gradient-to-b from-[#cbd5e1] to-[#94a3b8] rounded-b-sm" />
          </div>

          {/* Shaft (Main Body) with Fluting */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-36 overflow-hidden">
            {/* Marble background with fluting effect */}
            <div 
              className="absolute inset-0 rounded-sm"
              style={{
                background: `
                  linear-gradient(90deg, 
                    rgba(15, 23, 42, 0.8) 0%, 
                    rgba(30, 41, 59, 0.6) 20%,
                    rgba(30, 41, 59, 0.4) 40%,
                    rgba(30, 41, 59, 0.6) 60%,
                    rgba(30, 41, 59, 0.4) 80%,
                    rgba(15, 23, 42, 0.8) 100%
                  )
                `,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
              }}
            />
            
            {/* Glass effect border */}
            <div 
              className="absolute inset-0 rounded-sm"
              style={{
                border: '2px solid rgba(255, 215, 0, 0.3)',
                boxShadow: `
                  inset 0 0 10px rgba(255, 215, 0, 0.1),
                  0 0 15px rgba(255, 215, 0, 0.1)
                `,
              }}
            />

            {/* Golden Liquid Fill - Animated */}
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              initial={{ height: 0 }}
              animate={{ height: `${progress}%` }}
              transition={{
                duration: animationDuration,
                ease: 'easeOut',
              }}
              style={{
                background: `
                  linear-gradient(180deg,
                    rgba(255, 215, 0, 0.9) 0%,
                    rgba(255, 193, 7, 0.95) 30%,
                    rgba(255, 160, 0, 1) 60%,
                    rgba(255, 140, 0, 1) 100%
                  )
                `,
                boxShadow: `
                  inset 0 10px 20px rgba(255, 255, 255, 0.3),
                  inset 0 -5px 15px rgba(0, 0, 0, 0.2),
                  0 0 20px rgba(255, 215, 0, 0.5)
                `,
              }}
            >
              {/* Liquid Surface Animation */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-3"
                animate={{
                  y: [-2, 2, -2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: `
                    linear-gradient(180deg,
                      rgba(255, 255, 255, 0.6) 0%,
                      rgba(255, 215, 0, 0.8) 50%,
                      transparent 100%
                    )
                  `,
                  borderRadius: '50% 50% 0 0',
                }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundImage: `
                    linear-gradient(
                      45deg,
                      transparent 30%,
                      rgba(255, 255, 255, 0.4) 50%,
                      transparent 70%
                    )
                  `,
                  backgroundSize: '200% 200%',
                }}
              />
            </motion.div>

            {/* Percentage Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span 
                className="text-lg font-bold font-cinzel drop-shadow-lg"
                style={{
                  color: progress > 50 ? '#0f172a' : '#ffd700',
                  textShadow: progress > 50 
                    ? '0 0 10px rgba(255, 215, 0, 0.5)' 
                    : '0 0 10px rgba(0, 0, 0, 0.5)',
                }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Base (Bottom) - Stepped base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6">
            <div className="w-[85%] mx-auto h-2 bg-gradient-to-b from-[#94a3b8] to-[#cbd5e1] rounded-t-sm" />
            <div className="w-[90%] mx-auto h-2 bg-gradient-to-b from-[#cbd5e1] to-[#e2e8f0]" />
            <div className="w-full h-2 bg-gradient-to-b from-[#e2e8f0] to-[#f8fafc] rounded-b-sm shadow-md" />
          </div>
        </div>

        {/* Golden Glow Effect Behind Pillar */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 -z-10"
          style={{
            background: `radial-gradient(circle, rgba(255, 215, 0, ${0.1 + (progress / 500)}) 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-[#ffd700]/20 backdrop-blur-sm">
          {/* Ambrosia Counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400 font-inter">
              Ambrosia (XP)
            </span>
            <span className="text-lg font-cinzel font-bold text-[#ffd700]">
              {formatAmbrosia(currentAmbrosia)}
            </span>
          </div>

          {/* Progress to Next Rank */}
          {nextRank && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400 font-inter">
                To {RANK_DISPLAY_NAMES[nextRank]}
              </span>
              <span className="text-sm font-inter text-slate-300">
                {formatAmbrosia(ambrosiaToNext)} more
              </span>
            </div>
          )}

          {/* Linear Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: animationDuration,
                ease: 'easeOut',
              }}
              style={{
                background: 'linear-gradient(90deg, #ffd700 0%, #ff8c00 100%)',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            />
          </div>

          {/* Max Rank Message */}
          {!nextRank && (
            <div className="mt-4 text-center">
              <p className="text-[#ffd700] font-cinzel font-bold">
                ⚡ Maximum Rank Achieved ⚡
              </p>
              <p className="text-xs text-slate-400 font-inter mt-1">
                You have ascended to Olympus
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OdysseyProgressBar;
