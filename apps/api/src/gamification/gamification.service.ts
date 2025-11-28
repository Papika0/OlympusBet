import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaClient, Rank, Prisma } from '@prisma/client';

const Decimal = Prisma.Decimal;

/**
 * Ambrosia thresholds for each rank in the Odyssey leveling system.
 * 
 * In Greek mythology, Ambrosia was the food of the gods that conferred
 * immortality upon those who consumed it. In OlympusBet, Ambrosia represents
 * experience points earned through wagering.
 * 
 * @description The divine hierarchy thresholds:
 * - MORTAL (0): Starting rank - mere humans beginning their odyssey
 * - HOPLITE (1,000): Greek foot soldiers - the backbone of ancient armies
 * - HERO (10,000): Legendary figures - Achilles, Odysseus, Perseus
 * - DEMIGOD (100,000): Half-divine beings - Hercules, Helen of Troy
 * - OLYMPIAN (1,000,000): Full god status - Zeus, Athena, Apollo
 */
export const AMBROSIA_THRESHOLDS: Record<Rank, bigint> = {
  MORTAL: BigInt(0),
  HOPLITE: BigInt(1000),
  HERO: BigInt(10000),
  DEMIGOD: BigInt(100000),
  OLYMPIAN: BigInt(1000000),
};

/**
 * Ambrosia multiplier based on wager amount.
 * Higher wagers earn more Ambrosia to reward dedicated players.
 * 
 * Base rate: 1 Ambrosia per 1 USD equivalent wagered
 */
export const AMBROSIA_PER_USD = BigInt(1);

/**
 * Rank order for progression checking.
 * Follows the natural divine hierarchy from mortal to god.
 */
const RANK_ORDER: Rank[] = ['MORTAL', 'HOPLITE', 'HERO', 'DEMIGOD', 'OLYMPIAN'];

/**
 * Event payload for level up events.
 * Triggered when a user ascends to a new rank.
 */
export interface LevelUpEvent {
  /** User ID who leveled up */
  userId: string;
  /** Previous rank before leveling */
  previousRank: Rank;
  /** New rank achieved */
  newRank: Rank;
  /** Total Ambrosia at time of level up */
  totalAmbrosia: bigint;
  /** Timestamp of the level up */
  timestamp: Date;
}

/**
 * Result of Ambrosia calculation for a bet.
 */
export interface AmbrosiaCalculationResult {
  /** Amount of Ambrosia earned from this bet */
  ambrosiaEarned: bigint;
  /** User's total Ambrosia after this bet */
  totalAmbrosia: bigint;
  /** Whether this bet triggered a level up */
  leveledUp: boolean;
  /** Previous rank (if leveled up) */
  previousRank?: Rank;
  /** Current/new rank */
  currentRank: Rank;
}

/**
 * Input for processing a bet for Ambrosia calculation.
 */
export interface BetInput {
  /** User ID placing the bet */
  userId: string;
  /** Bet amount in USD equivalent */
  wagerAmountUsd: number;
  /** Currency of the bet */
  currency: string;
  /** Game identifier */
  gameId: string;
  /** Game round identifier */
  gameRoundId?: string;
}

/**
 * GamificationService - The Heart of the Odyssey Leveling System
 * 
 * This service manages the core gamification mechanics of OlympusBet,
 * implementing the "Odyssey" leveling system where users earn Ambrosia (XP)
 * for their wagers and progress through divine ranks.
 * 
 * @description
 * The Odyssey represents the user's journey from mortal to god, inspired by
 * Homer's epic. Each wager brings the user closer to Mount Olympus, with
 * "Golden Fleece" chests awarded at each rank milestone.
 * 
 * Key Features:
 * - Ambrosia (XP) calculation based on wager amount
 * - Rank progression from Mortal to Olympian
 * - Level-up event emission for rewards distribution
 * - Integration with the faction system for bonus multipliers
 * 
 * @example
 * ```typescript
 * // Process a bet and earn Ambrosia
 * const result = await gamificationService.processBet({
 *   userId: 'user123',
 *   wagerAmountUsd: 100,
 *   currency: 'ETH',
 *   gameId: 'blackjack'
 * });
 * 
 * if (result.leveledUp) {
 *   console.log(`User ascended from ${result.previousRank} to ${result.currentRank}!`);
 * }
 * ```
 */
@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Calculate the amount of Ambrosia earned from a wager.
   * 
   * @description
   * The formula follows a linear progression where 1 USD wagered = 1 Ambrosia.
   * Future enhancements could include:
   * - Faction bonuses (Sparta/Athens)
   * - VIP multipliers
   * - Promotional events
   * 
   * @param wagerAmountUsd - The wager amount in USD equivalent
   * @returns The Ambrosia earned as a BigInt
   */
  calculateAmbrosiaFromWager(wagerAmountUsd: number): bigint {
    // Ensure non-negative wager amount
    const sanitizedAmount = Math.max(0, Math.floor(wagerAmountUsd));
    return BigInt(sanitizedAmount) * AMBROSIA_PER_USD;
  }

  /**
   * Determine the rank based on total Ambrosia accumulated.
   * 
   * @description
   * Traverses the divine hierarchy in reverse to find the highest
   * rank the user has achieved based on their Ambrosia total.
   * 
   * @param totalAmbrosia - User's total Ambrosia
   * @returns The current Rank
   */
  getRankFromAmbrosia(totalAmbrosia: bigint): Rank {
    // Iterate from highest rank to lowest
    for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
      const rank = RANK_ORDER[i];
      if (totalAmbrosia >= AMBROSIA_THRESHOLDS[rank]) {
        return rank;
      }
    }
    return 'MORTAL';
  }

  /**
   * Check if Ambrosia amount triggers a level up from current rank.
   * 
   * @description
   * Compares the new Ambrosia total against the threshold for the
   * next rank in the divine hierarchy.
   * 
   * @param currentRank - User's current rank
   * @param newTotalAmbrosia - User's new total Ambrosia after earning
   * @returns Whether a level up occurred
   */
  checkLevelUp(currentRank: Rank, newTotalAmbrosia: bigint): boolean {
    const currentIndex = RANK_ORDER.indexOf(currentRank);
    
    // Already at max rank (Olympian)
    if (currentIndex >= RANK_ORDER.length - 1) {
      return false;
    }

    const nextRank = RANK_ORDER[currentIndex + 1];
    const nextThreshold = AMBROSIA_THRESHOLDS[nextRank];
    
    return newTotalAmbrosia >= nextThreshold;
  }

  /**
   * Get the next rank in the progression.
   * 
   * @param currentRank - Current rank
   * @returns Next rank or null if at max
   */
  getNextRank(currentRank: Rank): Rank | null {
    const currentIndex = RANK_ORDER.indexOf(currentRank);
    if (currentIndex < RANK_ORDER.length - 1) {
      return RANK_ORDER[currentIndex + 1];
    }
    return null;
  }

  /**
   * Get Ambrosia required to reach the next rank.
   * 
   * @param currentRank - User's current rank
   * @param currentAmbrosia - User's current Ambrosia total
   * @returns Ambrosia needed for next rank, or 0 if max rank
   */
  getAmbrosiaToNextRank(currentRank: Rank, currentAmbrosia: bigint): bigint {
    const nextRank = this.getNextRank(currentRank);
    if (!nextRank) {
      return BigInt(0);
    }
    
    const nextThreshold = AMBROSIA_THRESHOLDS[nextRank];
    return nextThreshold - currentAmbrosia;
  }

  /**
   * Process a bet and calculate Ambrosia earned.
   * 
   * @description
   * This is the main entry point for the gamification system. When a user
   * places a bet, this method:
   * 1. Calculates Ambrosia earned based on wager amount
   * 2. Updates the user's total Ambrosia
   * 3. Checks for rank progression
   * 4. Emits level-up events if applicable
   * 5. Triggers Golden Fleece chest rewards on level up
   * 
   * @param input - The bet details
   * @returns Calculation result with Ambrosia earned and level-up status
   * 
   * @emits 'user.levelUp' - When a user ascends to a new rank
   * @emits 'reward.goldenFleece' - When a Golden Fleece chest is awarded
   */
  async processBet(input: BetInput): Promise<AmbrosiaCalculationResult> {
    const { userId, wagerAmountUsd, gameId, gameRoundId, currency } = input;

    // Fetch current user state
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Calculate Ambrosia earned from this wager
    const ambrosiaEarned = this.calculateAmbrosiaFromWager(wagerAmountUsd);
    const previousAmbrosia = user.ambrosia;
    const newTotalAmbrosia = previousAmbrosia + ambrosiaEarned;
    const previousRank = user.rank;

    // Check for level up
    const leveledUp = this.checkLevelUp(previousRank, newTotalAmbrosia);
    const newRank = this.getRankFromAmbrosia(newTotalAmbrosia);

    // Update user with new Ambrosia and potentially new rank
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ambrosia: newTotalAmbrosia,
        rank: newRank,
      },
    });

    // Record the transaction with Ambrosia earned
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'BET',
        currency,
        amount: new Decimal(wagerAmountUsd),
        gameId,
        gameRoundId,
        ambrosiaEarned,
        status: 'COMPLETED',
      },
    });

    // Emit level-up event if applicable
    if (leveledUp) {
      const levelUpEvent: LevelUpEvent = {
        userId,
        previousRank,
        newRank,
        totalAmbrosia: newTotalAmbrosia,
        timestamp: new Date(),
      };

      this.logger.log(
        `🏛️ LEVEL UP! User ${userId} ascended from ${previousRank} to ${newRank}`,
      );

      // Emit the level up event for other services to handle
      this.eventEmitter.emit('user.levelUp', levelUpEvent);

      // Trigger Golden Fleece chest reward
      await this.awardGoldenFleeceChest(userId, newRank);
    }

    return {
      ambrosiaEarned,
      totalAmbrosia: newTotalAmbrosia,
      leveledUp,
      previousRank: leveledUp ? previousRank : undefined,
      currentRank: newRank,
    };
  }

  /**
   * Award a Golden Fleece chest for reaching a new rank.
   * 
   * @description
   * The Golden Fleece, sought by Jason and the Argonauts, represents
   * the treasures users earn upon ascending the divine hierarchy.
   * Each rank grants increasingly valuable rewards.
   * 
   * @param userId - User ID to award
   * @param rank - The rank achieved
   */
  private async awardGoldenFleeceChest(userId: string, rank: Rank): Promise<void> {
    // Golden Fleece rewards scale with rank
    const rewardAmounts: Record<Rank, number> = {
      MORTAL: 0, // Starting rank, no reward
      HOPLITE: 5, // 5 USD equivalent
      HERO: 25, // 25 USD equivalent
      DEMIGOD: 100, // 100 USD equivalent
      OLYMPIAN: 500, // 500 USD equivalent
    };

    const rewardAmount = rewardAmounts[rank];
    
    if (rewardAmount > 0) {
      // Create the reward record
      await this.prisma.reward.create({
        data: {
          userId,
          type: 'GOLDEN_FLEECE_CHEST',
          currency: 'USDT', // Default reward currency
          amount: rewardAmount,
          rankAchieved: rank,
          claimed: false,
        },
      });

      this.logger.log(
        `🏺 Golden Fleece Chest awarded to user ${userId} for reaching ${rank}: ${rewardAmount} USDT`,
      );

      // Emit reward event for notification system
      this.eventEmitter.emit('reward.goldenFleece', {
        userId,
        rank,
        amount: rewardAmount,
        currency: 'USDT',
      });
    }
  }

  /**
   * Get user's current Odyssey progress.
   * 
   * @param userId - User ID to query
   * @returns Current progress statistics
   */
  async getUserProgress(userId: string): Promise<{
    rank: Rank;
    ambrosia: bigint;
    nextRank: Rank | null;
    ambrosiaToNextRank: bigint;
    progressPercentage: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rank: true, ambrosia: true },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const nextRank = this.getNextRank(user.rank);
    const ambrosiaToNextRank = this.getAmbrosiaToNextRank(user.rank, user.ambrosia);

    // Calculate progress percentage
    let progressPercentage = 100;
    if (nextRank) {
      const currentThreshold = AMBROSIA_THRESHOLDS[user.rank];
      const nextThreshold = AMBROSIA_THRESHOLDS[nextRank];
      const range = nextThreshold - currentThreshold;
      const progress = user.ambrosia - currentThreshold;
      progressPercentage = Number((progress * BigInt(100)) / range);
    }

    return {
      rank: user.rank,
      ambrosia: user.ambrosia,
      nextRank,
      ambrosiaToNextRank,
      progressPercentage,
    };
  }

  /**
   * Apply faction bonus to Ambrosia calculation.
   * 
   * @description
   * Sparta and Athens offer different bonus structures:
   * - Sparta: Bonus multipliers on big wins
   * - Athens: Steady Ambrosia cashback
   * 
   * @param baseAmbrosia - Base Ambrosia before bonus
   * @param factionName - User's faction
   * @returns Ambrosia with faction bonus applied
   */
  applyFactionBonus(
    baseAmbrosia: bigint,
    factionName: 'SPARTA' | 'ATHENS' | null,
  ): bigint {
    if (!factionName) {
      return baseAmbrosia;
    }

    // Faction bonuses (could be fetched from DB for configurability)
    const factionBonuses: Record<'SPARTA' | 'ATHENS', number> = {
      SPARTA: 1.1, // 10% bonus (aggressive)
      ATHENS: 1.05, // 5% bonus (steady)
    };

    const bonus = factionBonuses[factionName];
    return BigInt(Math.floor(Number(baseAmbrosia) * bonus));
  }
}

export default GamificationService;
