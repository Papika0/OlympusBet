/**
 * FactionService - Sparta vs Athens Clan System
 * 
 * Handles faction-related logic including:
 * - XP contribution to factions
 * - Faction war scoring
 * - Faction rewards
 */

import { FactionType } from '@olympusbet/database';
import { FACTION_XP_SHARE_RATE, FACTION_WAR_DURATION_HOURS } from '../constants/gamification';

export interface FactionStats {
  type: FactionType;
  totalXp: bigint;
  totalMembers: number;
  totalWagered: bigint;
  wins: number;
}

export interface FactionWarResult {
  winner: FactionType | null;
  spartaScore: bigint;
  athensScore: bigint;
  isDraw: boolean;
  prizePool: bigint;
}

export interface FactionContribution {
  xpContribution: bigint;
  wagerContribution: bigint;
}

export class FactionService {
  /**
   * Calculate XP contribution to faction from personal ambrosia earned
   */
  calculateFactionXpContribution(ambrosiaEarned: bigint): bigint {
    return BigInt(Math.floor(Number(ambrosiaEarned) * FACTION_XP_SHARE_RATE));
  }

  /**
   * Calculate contributions from a bet to the user's faction
   */
  calculateBetContribution(betAmount: bigint, ambrosiaEarned: bigint): FactionContribution {
    return {
      xpContribution: this.calculateFactionXpContribution(ambrosiaEarned),
      wagerContribution: betAmount,
    };
  }

  /**
   * Determine war winner based on scores
   */
  determineWarWinner(spartaScore: bigint, athensScore: bigint): FactionType | null {
    if (spartaScore > athensScore) {
      return FactionType.SPARTA;
    } else if (athensScore > spartaScore) {
      return FactionType.ATHENS;
    }
    return null; // Draw
  }

  /**
   * Calculate war results
   */
  calculateWarResult(
    spartaScore: bigint,
    athensScore: bigint,
    prizePool: bigint
  ): FactionWarResult {
    const winner = this.determineWarWinner(spartaScore, athensScore);
    
    return {
      winner,
      spartaScore,
      athensScore,
      isDraw: winner === null,
      prizePool,
    };
  }

  /**
   * Calculate individual reward for war participation
   * Rewards are distributed based on contribution percentage
   */
  calculateMemberWarReward(
    memberContribution: bigint,
    totalFactionContribution: bigint,
    factionPrizeShare: bigint
  ): bigint {
    if (totalFactionContribution === BigInt(0)) {
      return BigInt(0);
    }
    
    // Calculate member's share of the faction prize
    const share = (memberContribution * BigInt(10000)) / totalFactionContribution;
    return (factionPrizeShare * share) / BigInt(10000);
  }

  /**
   * Calculate prize pool distribution for winning faction
   * 70% to winner, 30% to loser (in non-draw scenarios)
   */
  calculatePrizeDistribution(prizePool: bigint, isDraw: boolean): { winnerShare: bigint; loserShare: bigint } {
    if (isDraw) {
      const halfPool = prizePool / BigInt(2);
      return { winnerShare: halfPool, loserShare: halfPool };
    }
    
    const winnerShare = (prizePool * BigInt(70)) / BigInt(100);
    const loserShare = prizePool - winnerShare;
    
    return { winnerShare, loserShare };
  }

  /**
   * Get faction display information
   */
  getFactionInfo(type: FactionType): { name: string; description: string; color: string; motto: string } {
    if (type === FactionType.SPARTA) {
      return {
        name: 'Sparta',
        description: 'Warriors of strength and discipline. Glory through combat!',
        color: '#8B0000', // Dark red
        motto: 'Come back with your shield, or on it!',
      };
    }
    return {
      name: 'Athens',
      description: 'Scholars of wisdom and strategy. Victory through intellect!',
      color: '#1E3A5F', // Navy blue
      motto: 'Wisdom is the supreme part of happiness.',
    };
  }

  /**
   * Get default war duration in hours
   */
  getWarDurationHours(): number {
    return FACTION_WAR_DURATION_HOURS;
  }

  /**
   * Get XP share rate for factions
   */
  getXpShareRate(): number {
    return FACTION_XP_SHARE_RATE;
  }
}

export const factionService = new FactionService();
