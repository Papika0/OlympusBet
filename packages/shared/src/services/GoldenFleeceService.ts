/**
 * GoldenFleeceService - Progressive Jackpot System
 * 
 * Handles the global progressive jackpot logic including:
 * - Contribution calculation from bets
 * - Win eligibility checking
 * - Win probability calculation
 */

import {
  JACKPOT_CONTRIBUTION_RATE,
  JACKPOT_MIN_BET_FOR_ELIGIBILITY,
  JACKPOT_BASE_WIN_CHANCE,
} from '../constants/gamification';
import { Rank } from '@olympusbet/database';

export interface JackpotContributionResult {
  contributionAmount: bigint;
  isEligibleForWin: boolean;
  winChance: number;
}

export interface JackpotState {
  currentAmount: bigint;
  seedAmount: bigint;
  contributionRate: number;
}

export class GoldenFleeceService {
  /**
   * Calculate jackpot contribution from a bet
   */
  calculateContribution(betAmount: bigint, jackpotState: JackpotState): JackpotContributionResult {
    const contributionRate = jackpotState.contributionRate || JACKPOT_CONTRIBUTION_RATE;
    const contributionAmount = BigInt(Math.floor(Number(betAmount) * contributionRate));
    const isEligibleForWin = betAmount >= JACKPOT_MIN_BET_FOR_ELIGIBILITY;
    
    // Win chance scales with bet amount relative to jackpot
    const winChance = isEligibleForWin ? this.calculateWinChance(betAmount, jackpotState.currentAmount) : 0;
    
    return {
      contributionAmount,
      isEligibleForWin,
      winChance,
    };
  }

  /**
   * Calculate win probability based on bet amount and jackpot size
   * Higher bets and larger jackpots increase win chance
   */
  calculateWinChance(betAmount: bigint, jackpotAmount: bigint): number {
    if (betAmount < JACKPOT_MIN_BET_FOR_ELIGIBILITY) {
      return 0;
    }
    
    // Base chance increases with bet size (logarithmically)
    const betMultiplier = Math.log10(Number(betAmount) / Number(JACKPOT_MIN_BET_FOR_ELIGIBILITY) + 1);
    
    // Jackpot size increases chance (larger jackpots are more likely to hit)
    const jackpotMultiplier = jackpotAmount > BigInt(0) 
      ? Math.log10(Number(jackpotAmount) / 1000000 + 1) + 1 
      : 1;
    
    // Calculate final win chance, capped at 1%
    const winChance = JACKPOT_BASE_WIN_CHANCE * betMultiplier * jackpotMultiplier;
    return Math.min(winChance, 0.01);
  }

  /**
   * Check if a jackpot is won based on random roll
   * @param winChance - Probability of winning (0-1)
   * @param randomValue - Random value (0-1), typically from provably fair system
   */
  checkJackpotWin(winChance: number, randomValue: number): boolean {
    return randomValue < winChance;
  }

  /**
   * Calculate jackpot win amount (typically 100% of current jackpot)
   */
  calculateWinAmount(jackpotState: JackpotState): bigint {
    return jackpotState.currentAmount;
  }

  /**
   * Calculate new jackpot amount after a win (resets to seed)
   */
  calculatePostWinJackpot(jackpotState: JackpotState): bigint {
    return jackpotState.seedAmount;
  }

  /**
   * Get minimum bet required for jackpot eligibility
   */
  getMinimumBetForEligibility(): bigint {
    return JACKPOT_MIN_BET_FOR_ELIGIBILITY;
  }

  /**
   * Get the default contribution rate
   */
  getDefaultContributionRate(): number {
    return JACKPOT_CONTRIBUTION_RATE;
  }
}

export const goldenFleeceService = new GoldenFleeceService();
