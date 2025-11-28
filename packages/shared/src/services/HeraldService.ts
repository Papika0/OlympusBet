/**
 * HeraldService - Affiliate Tree System
 * 
 * Handles affiliate/referral logic including:
 * - Commission calculation
 * - Tier progression
 * - Multi-level referral tracking
 */

import { AFFILIATE_TIERS } from '../constants/gamification';

export interface AffiliateTier {
  tier: number;
  minReferrals: number;
  commission: number;
}

export interface CommissionResult {
  commissionAmount: bigint;
  affiliateTier: number;
  commissionRate: number;
}

export interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: bigint;
  currentTier: number;
  nextTier: AffiliateTier | null;
  referralsToNextTier: number;
}

export class HeraldService {
  private tiers: AffiliateTier[] = AFFILIATE_TIERS;

  /**
   * Calculate commission for an affiliate based on referred user's bet
   */
  calculateCommission(
    betAmount: bigint,
    houseEdge: bigint,
    affiliateTotalReferrals: number
  ): CommissionResult {
    const tier = this.getTierForReferralCount(affiliateTotalReferrals);
    const commissionRate = tier.commission;
    
    // Commission is calculated on house edge (the casino's profit from the bet)
    const commissionAmount = BigInt(Math.floor(Number(houseEdge) * commissionRate));
    
    return {
      commissionAmount,
      affiliateTier: tier.tier,
      commissionRate,
    };
  }

  /**
   * Get tier based on referral count
   */
  getTierForReferralCount(referralCount: number): AffiliateTier {
    let currentTier = this.tiers[0];
    
    for (const tier of this.tiers) {
      if (referralCount >= tier.minReferrals) {
        currentTier = tier;
      }
    }
    
    return currentTier;
  }

  /**
   * Get next tier (or null if at max)
   */
  getNextTier(currentTierNumber: number): AffiliateTier | null {
    const nextTierIndex = this.tiers.findIndex(t => t.tier === currentTierNumber + 1);
    if (nextTierIndex === -1) {
      return null;
    }
    return this.tiers[nextTierIndex];
  }

  /**
   * Calculate referrals needed for next tier
   */
  getReferralsToNextTier(currentReferrals: number): number {
    const currentTier = this.getTierForReferralCount(currentReferrals);
    const nextTier = this.getNextTier(currentTier.tier);
    
    if (!nextTier) {
      return 0; // Already at max tier
    }
    
    return nextTier.minReferrals - currentReferrals;
  }

  /**
   * Get affiliate statistics
   */
  getAffiliateStats(
    totalReferrals: number,
    activeReferrals: number,
    totalEarnings: bigint
  ): AffiliateStats {
    const currentTier = this.getTierForReferralCount(totalReferrals);
    const nextTier = this.getNextTier(currentTier.tier);
    
    return {
      totalReferrals,
      activeReferrals,
      totalEarnings,
      currentTier: currentTier.tier,
      nextTier,
      referralsToNextTier: this.getReferralsToNextTier(totalReferrals),
    };
  }

  /**
   * Generate affiliate code (to be used with database unique constraint)
   */
  generateAffiliateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Get all tiers
   */
  getAllTiers(): AffiliateTier[] {
    return [...this.tiers];
  }

  /**
   * Get tier info by tier number
   */
  getTierInfo(tierNumber: number): AffiliateTier | null {
    return this.tiers.find(t => t.tier === tierNumber) || null;
  }

  /**
   * Calculate multi-level commission (for deeper affiliate trees)
   * Level 1: Full commission
   * Level 2: 50% of commission
   * Level 3: 25% of commission
   */
  calculateMultiLevelCommission(
    betAmount: bigint,
    houseEdge: bigint,
    affiliateTotalReferrals: number,
    level: number
  ): CommissionResult {
    const baseCommission = this.calculateCommission(betAmount, houseEdge, affiliateTotalReferrals);
    
    // Reduce commission based on level depth
    let levelMultiplier = 1.0;
    if (level === 2) {
      levelMultiplier = 0.5;
    } else if (level === 3) {
      levelMultiplier = 0.25;
    } else if (level > 3) {
      levelMultiplier = 0; // No commission beyond level 3
    }
    
    const adjustedCommission = BigInt(Math.floor(Number(baseCommission.commissionAmount) * levelMultiplier));
    
    return {
      commissionAmount: adjustedCommission,
      affiliateTier: baseCommission.affiliateTier,
      commissionRate: baseCommission.commissionRate * levelMultiplier,
    };
  }
}

export const heraldService = new HeraldService();
