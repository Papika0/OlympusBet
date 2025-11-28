/**
 * The Odyssey - Rank Progression System
 * XP (Ambrosia) thresholds for each rank
 */

import { Rank } from '@olympusbet/database';

// Rank thresholds - Ambrosia (XP) required to reach each rank
export const RANK_THRESHOLDS: Record<Rank, bigint> = {
  [Rank.MORTAL]: BigInt(0),           // Starting rank
  [Rank.HERO]: BigInt(1000),          // 1,000 Ambrosia
  [Rank.DEMIGOD]: BigInt(10000),      // 10,000 Ambrosia
  [Rank.TITAN]: BigInt(50000),        // 50,000 Ambrosia
  [Rank.OLYMPIAN]: BigInt(150000),    // 150,000 Ambrosia
  [Rank.GOD]: BigInt(500000),         // 500,000 Ambrosia
};

// Rank order for progression
export const RANK_ORDER: Rank[] = [
  Rank.MORTAL,
  Rank.HERO,
  Rank.DEMIGOD,
  Rank.TITAN,
  Rank.OLYMPIAN,
  Rank.GOD,
];

// Level up thresholds within each rank (levels 1-10 per rank)
export const LEVELS_PER_RANK = 10;

// Base Ambrosia earned per wager unit
export const BASE_AMBROSIA_PER_WAGER = BigInt(1);

// Rank multipliers for Ambrosia earning
export const RANK_XP_MULTIPLIERS: Record<Rank, number> = {
  [Rank.MORTAL]: 1.0,
  [Rank.HERO]: 1.1,
  [Rank.DEMIGOD]: 1.25,
  [Rank.TITAN]: 1.5,
  [Rank.OLYMPIAN]: 1.75,
  [Rank.GOD]: 2.0,
};

// Rank display names and descriptions
export const RANK_INFO: Record<Rank, { name: string; title: string; description: string; color: string }> = {
  [Rank.MORTAL]: {
    name: 'Mortal',
    title: 'Humble Mortal',
    description: 'A newcomer to Mount Olympus, seeking glory and fortune.',
    color: '#8B7355', // Bronze-ish
  },
  [Rank.HERO]: {
    name: 'Hero',
    title: 'Aspiring Hero',
    description: 'Your deeds have caught the attention of the gods.',
    color: '#CD7F32', // Bronze
  },
  [Rank.DEMIGOD]: {
    name: 'Demigod',
    title: 'Blessed Demigod',
    description: 'Half divine, walking between two worlds.',
    color: '#C0C0C0', // Silver
  },
  [Rank.TITAN]: {
    name: 'Titan',
    title: 'Mighty Titan',
    description: 'Ancient power flows through your veins.',
    color: '#FFD700', // Gold
  },
  [Rank.OLYMPIAN]: {
    name: 'Olympian',
    title: 'Olympian Elite',
    description: 'A seat on Mount Olympus awaits you.',
    color: '#E5E4E2', // Platinum
  },
  [Rank.GOD]: {
    name: 'God',
    title: 'Divine God',
    description: 'You have achieved immortality among the gods.',
    color: '#B9F2FF', // Diamond
  },
};

// Golden Fleece - Jackpot constants
export const JACKPOT_CONTRIBUTION_RATE = 0.01; // 1% of each bet
export const JACKPOT_MIN_BET_FOR_ELIGIBILITY = BigInt(100); // Minimum bet to be eligible
export const JACKPOT_BASE_WIN_CHANCE = 0.0001; // 0.01% base chance

// Faction constants
export const FACTION_WAR_DURATION_HOURS = 24;
export const FACTION_XP_SHARE_RATE = 0.1; // 10% of personal XP goes to faction

// Affiliate/Herald constants
export const AFFILIATE_TIERS = [
  { tier: 1, minReferrals: 0, commission: 0.05 },   // 5% commission
  { tier: 2, minReferrals: 5, commission: 0.075 },  // 7.5% commission
  { tier: 3, minReferrals: 15, commission: 0.10 },  // 10% commission
  { tier: 4, minReferrals: 50, commission: 0.125 }, // 12.5% commission
  { tier: 5, minReferrals: 100, commission: 0.15 }, // 15% commission
];

// Crypto Rain constants
export const CRYPTO_RAIN_MIN_AMOUNT = BigInt(100);
export const CRYPTO_RAIN_MAX_CLAIMS = 100;
export const CRYPTO_RAIN_DURATION_MINUTES = 5;
