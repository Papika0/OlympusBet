import { Injectable } from '@nestjs/common';
import { GoldenFleeceService as SharedJackpotService, JackpotState } from '@olympusbet/shared';
import { prisma } from '@olympusbet/database';

/**
 * NestJS wrapper for the Golden Fleece Jackpot Service
 */
@Injectable()
export class JackpotService {
  private sharedService: SharedJackpotService;

  constructor() {
    this.sharedService = new SharedJackpotService();
  }

  /**
   * Get current jackpot state
   */
  async getCurrentJackpot() {
    const jackpot = await prisma.goldenFleeceJackpot.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!jackpot) {
      // Create initial jackpot if none exists
      return prisma.goldenFleeceJackpot.create({
        data: {
          currentAmount: BigInt(1000000), // Initial 1M seed
          seedAmount: BigInt(1000000),
          contributionRate: 0.01,
          isActive: true,
        },
      });
    }

    return jackpot;
  }

  /**
   * Process a bet's contribution to the jackpot
   */
  async processBetContribution(betAmount: bigint) {
    const jackpot = await this.getCurrentJackpot();
    
    const state: JackpotState = {
      currentAmount: jackpot.currentAmount,
      seedAmount: jackpot.seedAmount,
      contributionRate: jackpot.contributionRate,
    };

    const result = this.sharedService.calculateContribution(betAmount, state);

    // Update jackpot with contribution
    await prisma.goldenFleeceJackpot.update({
      where: { id: jackpot.id },
      data: {
        currentAmount: { increment: result.contributionAmount },
      },
    });

    return result;
  }

  /**
   * Check for jackpot win
   */
  async checkAndProcessWin(userId: string, betId: string, betAmount: bigint, randomValue: number) {
    const jackpot = await this.getCurrentJackpot();
    
    const state: JackpotState = {
      currentAmount: jackpot.currentAmount,
      seedAmount: jackpot.seedAmount,
      contributionRate: jackpot.contributionRate,
    };

    const { winChance } = this.sharedService.calculateContribution(betAmount, state);
    const isWin = this.sharedService.checkJackpotWin(winChance, randomValue);

    if (isWin) {
      const winAmount = this.sharedService.calculateWinAmount(state);
      
      // Create jackpot win record
      await prisma.jackpotWin.create({
        data: {
          jackpotId: jackpot.id,
          userId,
          amount: winAmount,
          triggerBetId: betId,
        },
      });

      // Reset jackpot to seed amount
      await prisma.goldenFleeceJackpot.update({
        where: { id: jackpot.id },
        data: {
          currentAmount: jackpot.seedAmount,
          lastWonAt: new Date(),
          lastWonAmount: winAmount,
          lastWinnerId: userId,
          totalWonAllTime: { increment: winAmount },
          timesWon: { increment: 1 },
        },
      });

      // Credit user wallet
      await prisma.wallet.update({
        where: { userId },
        data: {
          balance: { increment: winAmount },
          totalWon: { increment: winAmount },
        },
      });

      return { won: true, amount: winAmount };
    }

    return { won: false, amount: BigInt(0) };
  }

  /**
   * Get jackpot history
   */
  async getJackpotHistory(limit: number = 10) {
    return prisma.jackpotWin.findMany({
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
