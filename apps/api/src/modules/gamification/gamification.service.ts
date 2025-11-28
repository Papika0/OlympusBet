import { Injectable } from '@nestjs/common';
import { 
  GamificationService as SharedGamificationService,
  UserGamificationState,
  AmbrosiaResult,
  RankProgressInfo,
  RANK_INFO,
} from '@olympusbet/shared';
import { Rank, prisma } from '@olympusbet/database';

/**
 * NestJS wrapper for the shared GamificationService
 * Adds database operations and business logic specific to the API
 */
@Injectable()
export class GamificationService {
  private sharedService: SharedGamificationService;

  constructor() {
    this.sharedService = new SharedGamificationService();
  }

  /**
   * Award ambrosia to a user from a bet
   */
  async awardAmbrosiaFromBet(
    userId: string,
    betAmount: bigint,
    isWin: boolean = false,
    multiplier: number = 1.0
  ): Promise<AmbrosiaResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ambrosia: true, rank: true, level: true, factionId: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentState: UserGamificationState = {
      ambrosia: user.ambrosia,
      rank: user.rank,
      level: user.level,
    };

    // Calculate ambrosia earned
    const ambrosiaEarned = this.sharedService.calculateAmbrosiaFromBet(
      betAmount,
      user.rank,
      isWin,
      multiplier
    );

    // Award ambrosia and get result
    const result = this.sharedService.awardAmbrosia(currentState, ambrosiaEarned);

    // Update user in database
    const updateData: Record<string, unknown> = {
      ambrosia: result.newTotalAmbrosia,
      rank: result.newRank,
      level: result.newLevel,
    };

    // If user has a faction, also update their contribution
    if (user.factionId) {
      const factionContribution = this.sharedService.calculateFactionXpContribution(ambrosiaEarned);
      updateData.factionXpContribution = { increment: factionContribution };
      
      // Update faction total XP
      await prisma.faction.update({
        where: { id: user.factionId },
        data: { totalXp: { increment: factionContribution } },
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return result;
  }

  /**
   * Get user's progress information
   */
  async getUserProgress(userId: string): Promise<RankProgressInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ambrosia: true, rank: true, level: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sharedService.getProgressInfo({
      ambrosia: user.ambrosia,
      rank: user.rank,
      level: user.level,
    });
  }

  /**
   * Get rank information
   */
  getRankInfo(rank: Rank): typeof RANK_INFO[Rank] {
    return this.sharedService.getRankInfo(rank);
  }

  /**
   * Get all rank information
   */
  getAllRankInfo(): Array<{ rank: Rank; info: typeof RANK_INFO[Rank]; threshold: bigint }> {
    return this.sharedService.getAllRanks().map(rank => ({
      rank,
      info: this.sharedService.getRankInfo(rank),
      threshold: this.sharedService.getRankThreshold(rank),
    }));
  }

  /**
   * Get leaderboard by ambrosia
   */
  async getLeaderboard(limit: number = 100, offset: number = 0) {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        ambrosia: true,
        rank: true,
        level: true,
        faction: {
          select: { type: true, name: true },
        },
      },
      orderBy: { ambrosia: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
