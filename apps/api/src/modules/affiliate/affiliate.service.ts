import { Injectable } from '@nestjs/common';
import { HeraldService as SharedHeraldService } from '@olympusbet/shared';
import { prisma } from '@olympusbet/database';

/**
 * NestJS wrapper for the Herald Affiliate Service
 */
@Injectable()
export class AffiliateService {
  private sharedService: SharedHeraldService;

  constructor() {
    this.sharedService = new SharedHeraldService();
  }

  /**
   * Get affiliate stats for a user
   */
  async getAffiliateStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: { id: true, createdAt: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate active referrals (users who have made at least one bet in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeReferrals = await prisma.bet.groupBy({
      by: ['userId'],
      where: {
        userId: { in: user.referrals.map(r => r.id) },
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    return this.sharedService.getAffiliateStats(
      user.referrals.length,
      activeReferrals.length,
      user.affiliateEarnings
    );
  }

  /**
   * Get affiliate code for a user
   */
  async getAffiliateCode(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { affiliateCode: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return { affiliateCode: user.affiliateCode };
  }

  /**
   * Register with affiliate code
   */
  async registerWithAffiliateCode(userId: string, affiliateCode: string) {
    // Find the referring user
    const referrer = await prisma.user.findUnique({
      where: { affiliateCode },
      select: { id: true },
    });

    if (!referrer) {
      throw new Error('Invalid affiliate code');
    }

    if (referrer.id === userId) {
      throw new Error('Cannot refer yourself');
    }

    // Check if user already has a referrer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredById: true },
    });

    if (user?.referredById) {
      throw new Error('User already has a referrer');
    }

    // Update user with referrer
    await prisma.user.update({
      where: { id: userId },
      data: { referredById: referrer.id },
    });

    return { success: true };
  }

  /**
   * Process affiliate commission from a bet
   */
  async processAffiliateCommission(userId: string, betAmount: bigint, houseEdge: bigint) {
    // Get user's referrer chain (up to 3 levels)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referredBy: {
          select: {
            id: true,
            referrals: { select: { id: true } },
            referredBy: {
              select: {
                id: true,
                referrals: { select: { id: true } },
                referredBy: {
                  select: {
                    id: true,
                    referrals: { select: { id: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.referredBy) {
      return []; // No referrer
    }

    const commissions: Array<{ userId: string; amount: bigint; level: number }> = [];

    // Level 1 commission
    const level1 = this.sharedService.calculateMultiLevelCommission(
      betAmount,
      houseEdge,
      user.referredBy.referrals.length,
      1
    );
    if (level1.commissionAmount > BigInt(0)) {
      commissions.push({
        userId: user.referredBy.id,
        amount: level1.commissionAmount,
        level: 1,
      });
    }

    // Level 2 commission
    if (user.referredBy.referredBy) {
      const level2 = this.sharedService.calculateMultiLevelCommission(
        betAmount,
        houseEdge,
        user.referredBy.referredBy.referrals.length,
        2
      );
      if (level2.commissionAmount > BigInt(0)) {
        commissions.push({
          userId: user.referredBy.referredBy.id,
          amount: level2.commissionAmount,
          level: 2,
        });
      }

      // Level 3 commission
      if (user.referredBy.referredBy.referredBy) {
        const level3 = this.sharedService.calculateMultiLevelCommission(
          betAmount,
          houseEdge,
          user.referredBy.referredBy.referredBy.referrals.length,
          3
        );
        if (level3.commissionAmount > BigInt(0)) {
          commissions.push({
            userId: user.referredBy.referredBy.referredBy.id,
            amount: level3.commissionAmount,
            level: 3,
          });
        }
      }
    }

    // Apply commissions
    for (const commission of commissions) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: commission.userId },
          data: { affiliateEarnings: { increment: commission.amount } },
        }),
        prisma.wallet.update({
          where: { userId: commission.userId },
          data: { balance: { increment: commission.amount } },
        }),
      ]);
    }

    return commissions;
  }

  /**
   * Get referral list
   */
  async getReferrals(userId: string) {
    return prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
        rank: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all tier information
   */
  getAllTiers() {
    return this.sharedService.getAllTiers();
  }
}
