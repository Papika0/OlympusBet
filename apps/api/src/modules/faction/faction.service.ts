import { Injectable } from '@nestjs/common';
import { FactionService as SharedFactionService } from '@olympusbet/shared';
import { prisma, FactionType } from '@olympusbet/database';

/**
 * NestJS wrapper for the Faction Service (Sparta vs Athens)
 */
@Injectable()
export class FactionService {
  private sharedService: SharedFactionService;

  constructor() {
    this.sharedService = new SharedFactionService();
  }

  /**
   * Get or create factions
   */
  async getFactions() {
    const factions = await prisma.faction.findMany();
    
    // Create factions if they don't exist
    if (factions.length === 0) {
      const spartaInfo = this.sharedService.getFactionInfo(FactionType.SPARTA);
      const athensInfo = this.sharedService.getFactionInfo(FactionType.ATHENS);
      
      await prisma.$transaction([
        prisma.faction.create({
          data: {
            type: FactionType.SPARTA,
            name: spartaInfo.name,
            description: spartaInfo.description,
          },
        }),
        prisma.faction.create({
          data: {
            type: FactionType.ATHENS,
            name: athensInfo.name,
            description: athensInfo.description,
          },
        }),
      ]);
      
      return prisma.faction.findMany();
    }
    
    return factions;
  }

  /**
   * Get a specific faction
   */
  async getFaction(type: FactionType) {
    return prisma.faction.findUnique({
      where: { type },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  /**
   * Join a faction
   */
  async joinFaction(userId: string, factionType: FactionType) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { factionId: true },
    });

    if (user?.factionId) {
      throw new Error('User is already in a faction');
    }

    const faction = await prisma.faction.findUnique({
      where: { type: factionType },
    });

    if (!faction) {
      throw new Error('Faction not found');
    }

    // Update user and faction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          factionId: faction.id,
          factionJoinedAt: new Date(),
        },
      }),
      prisma.faction.update({
        where: { id: faction.id },
        data: { totalMembers: { increment: 1 } },
      }),
    ]);

    return faction;
  }

  /**
   * Leave a faction
   */
  async leaveFaction(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { factionId: true, factionXpContribution: true },
    });

    if (!user?.factionId) {
      throw new Error('User is not in a faction');
    }

    // Update user and faction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          factionId: null,
          factionJoinedAt: null,
          factionXpContribution: BigInt(0),
        },
      }),
      prisma.faction.update({
        where: { id: user.factionId },
        data: {
          totalMembers: { decrement: 1 },
          totalXp: { decrement: user.factionXpContribution },
        },
      }),
    ]);

    return { success: true };
  }

  /**
   * Get faction leaderboard (members by XP contribution)
   */
  async getFactionLeaderboard(factionType: FactionType, limit: number = 100) {
    const faction = await prisma.faction.findUnique({
      where: { type: factionType },
    });

    if (!faction) {
      throw new Error('Faction not found');
    }

    return prisma.user.findMany({
      where: { factionId: faction.id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        rank: true,
        factionXpContribution: true,
      },
      orderBy: { factionXpContribution: 'desc' },
      take: limit,
    });
  }

  /**
   * Get active faction war
   */
  async getActiveWar() {
    return prisma.factionWar.findFirst({
      where: { isActive: true },
      include: {
        participants: true,
        winner: true,
      },
    });
  }

  /**
   * Get faction stats
   */
  async getFactionStats() {
    const factions = await prisma.faction.findMany({
      include: {
        _count: { select: { members: true } },
      },
    });

    return factions.map(faction => ({
      type: faction.type,
      name: faction.name,
      info: this.sharedService.getFactionInfo(faction.type),
      totalXp: faction.totalXp,
      totalMembers: faction.totalMembers,
      totalWagered: faction.totalWagered,
      wins: faction.wins,
    }));
  }
}
