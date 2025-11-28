export * from '@prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of PrismaClient for database operations.
 * 
 * In development, we store the client on the global object to prevent
 * multiple instances from being created during hot reloading.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

/**
 * Ambrosia thresholds for each rank in the Odyssey leveling system.
 * These are the divine food of the gods - XP points that determine rank.
 * 
 * MORTAL: 0 - Starting rank
 * HOPLITE: 1,000 - Greek foot soldiers
 * HERO: 10,000 - Legendary figures
 * DEMIGOD: 100,000 - Half-divine beings
 * OLYMPIAN: 1,000,000 - Full god status
 */
export const AMBROSIA_THRESHOLDS = {
  MORTAL: BigInt(0),
  HOPLITE: BigInt(1000),
  HERO: BigInt(10000),
  DEMIGOD: BigInt(100000),
  OLYMPIAN: BigInt(1000000),
} as const;

/**
 * Referral commission rates for the Heralds system.
 * Heralds earn a percentage of the house edge from their recruits.
 */
export const REFERRAL_COMMISSION_RATES = {
  TIER_1: 0.40, // 40% of house edge for direct referrals
  TIER_2: 0.10, // 10% of house edge for tier 2
  TIER_3: 0.05, // 5% of house edge for tier 3
} as const;

/**
 * Zeus's Rain configuration - divine crypto distribution in chat.
 */
export const ZEUS_RAIN_CONFIG = {
  INTERVAL_HOURS: 4,
  MIN_ACTIVE_USERS: 5,
} as const;
