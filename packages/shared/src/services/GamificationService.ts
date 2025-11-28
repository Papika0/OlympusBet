/**
 * GamificationService - The Odyssey XP/Ambrosia System
 * 
 * Handles all gamification logic for OlympusBet including:
 * - Ambrosia (XP) calculation and awarding
 * - Rank progression from Mortal to God
 * - Level advancement within ranks
 * - Rank-based multipliers and bonuses
 */

import { Rank } from '@olympusbet/database';
import {
  RANK_THRESHOLDS,
  RANK_ORDER,
  LEVELS_PER_RANK,
  BASE_AMBROSIA_PER_WAGER,
  RANK_XP_MULTIPLIERS,
  RANK_INFO,
  FACTION_XP_SHARE_RATE,
} from '../constants/gamification';

export interface AmbrosiaResult {
  ambrosiaEarned: bigint;
  newTotalAmbrosia: bigint;
  previousRank: Rank;
  newRank: Rank;
  previousLevel: number;
  newLevel: number;
  rankUp: boolean;
  levelUp: boolean;
}

export interface UserGamificationState {
  ambrosia: bigint;
  rank: Rank;
  level: number;
}

export interface RankProgressInfo {
  currentRank: Rank;
  currentRankInfo: typeof RANK_INFO[Rank];
  nextRank: Rank | null;
  nextRankInfo: typeof RANK_INFO[Rank] | null;
  currentAmbrosia: bigint;
  ambrosiaForNextRank: bigint | null;
  progressToNextRank: number; // 0-100 percentage
  currentLevel: number;
  progressToNextLevel: number; // 0-100 percentage
}

/**
 * GamificationService handles all XP/Ambrosia and ranking logic
 */
export class GamificationService {
  /**
   * Calculate Ambrosia earned from a bet
   * @param wagerAmount - Amount wagered in smallest unit
   * @param currentRank - User's current rank for multiplier
   * @param isWin - Whether the bet was won (bonus for wins)
   * @param multiplier - Game multiplier achieved (for wins)
   */
  calculateAmbrosiaFromBet(
    wagerAmount: bigint,
    currentRank: Rank,
    isWin: boolean = false,
    multiplier: number = 1.0
  ): bigint {
    // Base ambrosia is 1 per 100 units wagered
    const baseAmbrosia = wagerAmount / BigInt(100);
    
    // Apply rank multiplier
    const rankMultiplier = RANK_XP_MULTIPLIERS[currentRank];
    
    // Win bonus: 50% base bonus + extra scaled by multiplier (capped at 10x)
    // For a 2x win: 1 + 0.5 + (2/10 * 0.5) = 1.6
    // For a 10x win: 1 + 0.5 + (10/10 * 0.5) = 2.0
    const winBonus = isWin ? 1.0 + 0.5 + (Math.min(multiplier, 10) / 10 * 0.5) : 1.0;
    
    // Calculate final ambrosia
    const finalMultiplier = rankMultiplier * winBonus;
    const ambrosia = BigInt(Math.floor(Number(baseAmbrosia) * finalMultiplier));
    
    // Minimum 1 ambrosia for any bet over threshold
    return ambrosia > BigInt(0) ? ambrosia : wagerAmount > BigInt(0) ? BigInt(1) : BigInt(0);
  }

  /**
   * Award Ambrosia to a user and calculate rank/level changes
   */
  awardAmbrosia(
    currentState: UserGamificationState,
    ambrosiaToAdd: bigint
  ): AmbrosiaResult {
    const previousRank = currentState.rank;
    const previousLevel = currentState.level;
    const newTotalAmbrosia = currentState.ambrosia + ambrosiaToAdd;
    
    // Calculate new rank
    const newRank = this.calculateRankFromAmbrosia(newTotalAmbrosia);
    
    // Calculate new level
    const newLevel = this.calculateLevelFromAmbrosia(newTotalAmbrosia, newRank);
    
    return {
      ambrosiaEarned: ambrosiaToAdd,
      newTotalAmbrosia,
      previousRank,
      newRank,
      previousLevel,
      newLevel,
      rankUp: this.getRankIndex(newRank) > this.getRankIndex(previousRank),
      levelUp: newLevel > previousLevel || this.getRankIndex(newRank) > this.getRankIndex(previousRank),
    };
  }

  /**
   * Calculate rank based on total Ambrosia
   */
  calculateRankFromAmbrosia(ambrosia: bigint): Rank {
    // Iterate in reverse to find highest qualifying rank
    for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
      const rank = RANK_ORDER[i];
      if (ambrosia >= RANK_THRESHOLDS[rank]) {
        return rank;
      }
    }
    return Rank.MORTAL;
  }

  /**
   * Calculate level within current rank (1-10)
   */
  calculateLevelFromAmbrosia(ambrosia: bigint, rank: Rank): number {
    const rankIndex = this.getRankIndex(rank);
    const currentThreshold = RANK_THRESHOLDS[rank];
    
    // If at max rank, calculate level based on ambrosia beyond threshold
    if (rankIndex === RANK_ORDER.length - 1) {
      const beyondThreshold = ambrosia - currentThreshold;
      // Every 100,000 ambrosia beyond GOD threshold is a level
      const level = Number(beyondThreshold / BigInt(100000)) + 1;
      return Math.min(level, 100); // Cap at level 100 for GOD rank
    }
    
    // Calculate progress within rank
    const nextRank = RANK_ORDER[rankIndex + 1];
    const nextThreshold = RANK_THRESHOLDS[nextRank];
    const rangeSize = nextThreshold - currentThreshold;
    const progress = ambrosia - currentThreshold;
    
    // Divide range into LEVELS_PER_RANK levels
    const levelSize = rangeSize / BigInt(LEVELS_PER_RANK);
    const level = Number(progress / levelSize) + 1;
    
    return Math.min(Math.max(level, 1), LEVELS_PER_RANK);
  }

  /**
   * Get detailed progress information for a user
   */
  getProgressInfo(state: UserGamificationState): RankProgressInfo {
    const rankIndex = this.getRankIndex(state.rank);
    const isMaxRank = rankIndex === RANK_ORDER.length - 1;
    const nextRank = isMaxRank ? null : RANK_ORDER[rankIndex + 1];
    
    // Calculate progress to next rank
    let progressToNextRank = 100;
    let ambrosiaForNextRank: bigint | null = null;
    
    if (nextRank) {
      ambrosiaForNextRank = RANK_THRESHOLDS[nextRank];
      const currentThreshold = RANK_THRESHOLDS[state.rank];
      const rangeSize = Number(ambrosiaForNextRank - currentThreshold);
      const progress = Number(state.ambrosia - currentThreshold);
      progressToNextRank = Math.min((progress / rangeSize) * 100, 100);
    }
    
    // Calculate progress to next level
    const progressToNextLevel = this.calculateLevelProgress(state.ambrosia, state.rank, state.level);
    
    return {
      currentRank: state.rank,
      currentRankInfo: RANK_INFO[state.rank],
      nextRank,
      nextRankInfo: nextRank ? RANK_INFO[nextRank] : null,
      currentAmbrosia: state.ambrosia,
      ambrosiaForNextRank,
      progressToNextRank,
      currentLevel: state.level,
      progressToNextLevel,
    };
  }

  /**
   * Calculate progress percentage to next level
   */
  calculateLevelProgress(ambrosia: bigint, rank: Rank, currentLevel: number): number {
    const rankIndex = this.getRankIndex(rank);
    const currentThreshold = RANK_THRESHOLDS[rank];
    
    if (rankIndex === RANK_ORDER.length - 1) {
      // GOD rank - each level is 100,000 ambrosia
      const levelSize = BigInt(100000);
      const baseForLevel = currentThreshold + (BigInt(currentLevel - 1) * levelSize);
      const progress = ambrosia - baseForLevel;
      return Math.min(Number((progress * BigInt(100)) / levelSize), 100);
    }
    
    const nextRank = RANK_ORDER[rankIndex + 1];
    const nextThreshold = RANK_THRESHOLDS[nextRank];
    const rangeSize = nextThreshold - currentThreshold;
    const levelSize = rangeSize / BigInt(LEVELS_PER_RANK);
    
    const baseForLevel = currentThreshold + (BigInt(currentLevel - 1) * levelSize);
    const progress = ambrosia - baseForLevel;
    
    return Math.min(Number((progress * BigInt(100)) / levelSize), 100);
  }

  /**
   * Calculate faction XP contribution from personal ambrosia earned
   */
  calculateFactionXpContribution(ambrosiaEarned: bigint): bigint {
    return BigInt(Math.floor(Number(ambrosiaEarned) * FACTION_XP_SHARE_RATE));
  }

  /**
   * Get rank display information
   */
  getRankInfo(rank: Rank): typeof RANK_INFO[Rank] {
    return RANK_INFO[rank];
  }

  /**
   * Get threshold for a specific rank
   */
  getRankThreshold(rank: Rank): bigint {
    return RANK_THRESHOLDS[rank];
  }

  /**
   * Get rank index in progression order
   */
  getRankIndex(rank: Rank): number {
    return RANK_ORDER.indexOf(rank);
  }

  /**
   * Check if user qualifies for a rank
   */
  qualifiesForRank(ambrosia: bigint, rank: Rank): boolean {
    return ambrosia >= RANK_THRESHOLDS[rank];
  }

  /**
   * Get all ranks in order
   */
  getAllRanks(): Rank[] {
    return [...RANK_ORDER];
  }

  /**
   * Get next rank (or null if at max)
   */
  getNextRank(currentRank: Rank): Rank | null {
    const index = this.getRankIndex(currentRank);
    if (index >= RANK_ORDER.length - 1) {
      return null;
    }
    return RANK_ORDER[index + 1];
  }

  /**
   * Get ambrosia needed for next rank
   */
  getAmbrosiaForNextRank(currentRank: Rank): bigint | null {
    const nextRank = this.getNextRank(currentRank);
    if (!nextRank) {
      return null;
    }
    return RANK_THRESHOLDS[nextRank];
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();
