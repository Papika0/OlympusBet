'use client';

import { RANK_INFO, RANK_THRESHOLDS, RANK_ORDER, Rank } from '@olympusbet/shared';

interface RankBadgeProps {
  rank: Rank;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, showTitle = false, size = 'md' }: RankBadgeProps) {
  const info = RANK_INFO[rank];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      className={`badge-rank ${sizeClasses[size]} inline-flex items-center gap-1`}
      style={{ backgroundColor: info.color }}
    >
      <span>{info.name}</span>
      {showTitle && <span className="opacity-75">- {info.title}</span>}
    </span>
  );
}

interface RankProgressProps {
  currentAmbrosia: bigint;
  currentRank: Rank;
  showLabels?: boolean;
}

export function RankProgress({ currentAmbrosia, currentRank, showLabels = true }: RankProgressProps) {
  const rankIndex = RANK_ORDER.indexOf(currentRank);
  const isMaxRank = rankIndex === RANK_ORDER.length - 1;
  
  let progress = 100;
  let nextRankName = '';
  let nextRankAmbrosia = BigInt(0);
  
  if (!isMaxRank) {
    const nextRank = RANK_ORDER[rankIndex + 1];
    nextRankName = RANK_INFO[nextRank].name;
    nextRankAmbrosia = RANK_THRESHOLDS[nextRank];
    
    const currentThreshold = RANK_THRESHOLDS[currentRank];
    const rangeSize = Number(nextRankAmbrosia - currentThreshold);
    const currentProgress = Number(currentAmbrosia - currentThreshold);
    progress = Math.min((currentProgress / rangeSize) * 100, 100);
  }
  
  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-marble-400">
            {currentAmbrosia.toLocaleString()} Ambrosia
          </span>
          {!isMaxRank && (
            <span className="text-marble-400">
              {nextRankAmbrosia.toLocaleString()} ({nextRankName})
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface RankCardProps {
  rank: Rank;
  isUnlocked: boolean;
  isCurrent?: boolean;
}

export function RankCard({ rank, isUnlocked, isCurrent = false }: RankCardProps) {
  const info = RANK_INFO[rank];
  const threshold = RANK_THRESHOLDS[rank];
  
  return (
    <div
      className={`card-marble p-4 border transition-all ${
        isCurrent
          ? 'border-gold-500 shadow-gold-glow'
          : isUnlocked
          ? 'border-gold-600/30'
          : 'border-marble-700 opacity-50'
      }`}
    >
      <div
        className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-2xl"
        style={{ backgroundColor: `${info.color}20`, border: `2px solid ${info.color}` }}
      >
        {rank === Rank.MORTAL && '👤'}
        {rank === Rank.HERO && '⚔️'}
        {rank === Rank.DEMIGOD && '🌟'}
        {rank === Rank.TITAN && '💪'}
        {rank === Rank.OLYMPIAN && '🏛️'}
        {rank === Rank.GOD && '⚡'}
      </div>
      <h3 className="font-display text-lg" style={{ color: info.color }}>
        {info.name}
      </h3>
      <p className="text-xs text-marble-400">{info.title}</p>
      <p className="text-xs text-marble-500 mt-2">
        {threshold.toLocaleString()} Ambrosia
      </p>
      {isCurrent && (
        <span className="text-xs text-gold-500 mt-2 block">✓ Current Rank</span>
      )}
    </div>
  );
}
