/**
 * Tests for GamificationService - The Odyssey XP/Ambrosia System
 */

import { GamificationService, UserGamificationState } from '../services/GamificationService';
import { Rank } from '@olympusbet/database';
import { RANK_THRESHOLDS, RANK_ORDER } from '../constants/gamification';

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(() => {
    service = new GamificationService();
  });

  describe('calculateAmbrosiaFromBet', () => {
    it('should calculate base ambrosia for a bet', () => {
      const wagerAmount = BigInt(10000); // 10,000 units
      const ambrosia = service.calculateAmbrosiaFromBet(wagerAmount, Rank.MORTAL);
      
      // Base is 1 per 100 wagered, so 100 base * 1.0 rank multiplier = 100
      expect(ambrosia).toBe(BigInt(100));
    });

    it('should apply rank multiplier', () => {
      const wagerAmount = BigInt(10000);
      const mortalAmbrosia = service.calculateAmbrosiaFromBet(wagerAmount, Rank.MORTAL);
      const godAmbrosia = service.calculateAmbrosiaFromBet(wagerAmount, Rank.GOD);
      
      // GOD rank has 2.0 multiplier vs MORTAL 1.0
      expect(godAmbrosia).toBe(BigInt(200)); // 100 * 2.0
      expect(godAmbrosia > mortalAmbrosia).toBe(true);
    });

    it('should apply win bonus', () => {
      const wagerAmount = BigInt(10000);
      const lossAmbrosia = service.calculateAmbrosiaFromBet(wagerAmount, Rank.MORTAL, false);
      const winAmbrosia = service.calculateAmbrosiaFromBet(wagerAmount, Rank.MORTAL, true, 2.0);
      
      expect(winAmbrosia > lossAmbrosia).toBe(true);
    });

    it('should return minimum 1 ambrosia for any positive bet', () => {
      const smallBet = BigInt(10); // Very small bet
      const ambrosia = service.calculateAmbrosiaFromBet(smallBet, Rank.MORTAL);
      
      expect(ambrosia >= BigInt(1)).toBe(true);
    });

    it('should return 0 ambrosia for 0 bet', () => {
      const zeroBet = BigInt(0);
      const ambrosia = service.calculateAmbrosiaFromBet(zeroBet, Rank.MORTAL);
      
      expect(ambrosia).toBe(BigInt(0));
    });
  });

  describe('calculateRankFromAmbrosia', () => {
    it('should return MORTAL for 0 ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(0))).toBe(Rank.MORTAL);
    });

    it('should return HERO for 1000+ ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(1000))).toBe(Rank.HERO);
      expect(service.calculateRankFromAmbrosia(BigInt(5000))).toBe(Rank.HERO);
    });

    it('should return DEMIGOD for 10000+ ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(10000))).toBe(Rank.DEMIGOD);
    });

    it('should return TITAN for 50000+ ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(50000))).toBe(Rank.TITAN);
    });

    it('should return OLYMPIAN for 150000+ ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(150000))).toBe(Rank.OLYMPIAN);
    });

    it('should return GOD for 500000+ ambrosia', () => {
      expect(service.calculateRankFromAmbrosia(BigInt(500000))).toBe(Rank.GOD);
      expect(service.calculateRankFromAmbrosia(BigInt(1000000))).toBe(Rank.GOD);
    });
  });

  describe('awardAmbrosia', () => {
    it('should correctly add ambrosia', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(500),
        rank: Rank.MORTAL,
        level: 1,
      };
      
      const result = service.awardAmbrosia(state, BigInt(100));
      
      expect(result.newTotalAmbrosia).toBe(BigInt(600));
      expect(result.ambrosiaEarned).toBe(BigInt(100));
    });

    it('should detect rank up', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(900),
        rank: Rank.MORTAL,
        level: 9,
      };
      
      const result = service.awardAmbrosia(state, BigInt(200));
      
      expect(result.rankUp).toBe(true);
      expect(result.previousRank).toBe(Rank.MORTAL);
      expect(result.newRank).toBe(Rank.HERO);
    });

    it('should detect level up within rank', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(100),
        rank: Rank.MORTAL,
        level: 1,
      };
      
      const result = service.awardAmbrosia(state, BigInt(200));
      
      expect(result.levelUp).toBe(true);
      expect(result.newLevel > result.previousLevel).toBe(true);
    });

    it('should not indicate rank up when staying in same rank', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(500),
        rank: Rank.MORTAL,
        level: 5,
      };
      
      const result = service.awardAmbrosia(state, BigInt(100));
      
      expect(result.rankUp).toBe(false);
      expect(result.newRank).toBe(Rank.MORTAL);
    });
  });

  describe('calculateLevelFromAmbrosia', () => {
    it('should return level 1 at rank threshold', () => {
      const level = service.calculateLevelFromAmbrosia(BigInt(0), Rank.MORTAL);
      expect(level).toBe(1);
    });

    it('should progress levels within rank', () => {
      // MORTAL range: 0-999 (1000 total), 10 levels = 100 per level
      const level1 = service.calculateLevelFromAmbrosia(BigInt(0), Rank.MORTAL);
      const level5 = service.calculateLevelFromAmbrosia(BigInt(450), Rank.MORTAL);
      const level10 = service.calculateLevelFromAmbrosia(BigInt(950), Rank.MORTAL);
      
      expect(level1).toBe(1);
      expect(level5).toBeGreaterThan(level1);
      expect(level10).toBe(10);
    });

    it('should handle GOD rank levels', () => {
      const level = service.calculateLevelFromAmbrosia(BigInt(600000), Rank.GOD);
      expect(level).toBe(2); // 100k beyond threshold = level 2
    });
  });

  describe('getProgressInfo', () => {
    it('should return correct progress info for MORTAL', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(500),
        rank: Rank.MORTAL,
        level: 5,
      };
      
      const info = service.getProgressInfo(state);
      
      expect(info.currentRank).toBe(Rank.MORTAL);
      expect(info.nextRank).toBe(Rank.HERO);
      expect(info.ambrosiaForNextRank).toBe(RANK_THRESHOLDS[Rank.HERO]);
      expect(info.progressToNextRank).toBe(50); // 500/1000 = 50%
    });

    it('should return null next rank for GOD', () => {
      const state: UserGamificationState = {
        ambrosia: BigInt(500000),
        rank: Rank.GOD,
        level: 1,
      };
      
      const info = service.getProgressInfo(state);
      
      expect(info.currentRank).toBe(Rank.GOD);
      expect(info.nextRank).toBeNull();
      expect(info.ambrosiaForNextRank).toBeNull();
      expect(info.progressToNextRank).toBe(100);
    });
  });

  describe('Rank utilities', () => {
    it('should return all ranks in order', () => {
      const ranks = service.getAllRanks();
      expect(ranks).toEqual(RANK_ORDER);
    });

    it('should get correct next rank', () => {
      expect(service.getNextRank(Rank.MORTAL)).toBe(Rank.HERO);
      expect(service.getNextRank(Rank.TITAN)).toBe(Rank.OLYMPIAN);
      expect(service.getNextRank(Rank.GOD)).toBeNull();
    });

    it('should get correct rank threshold', () => {
      expect(service.getRankThreshold(Rank.MORTAL)).toBe(BigInt(0));
      expect(service.getRankThreshold(Rank.GOD)).toBe(BigInt(500000));
    });

    it('should check rank qualification correctly', () => {
      expect(service.qualifiesForRank(BigInt(999), Rank.HERO)).toBe(false);
      expect(service.qualifiesForRank(BigInt(1000), Rank.HERO)).toBe(true);
    });
  });

  describe('Faction XP contribution', () => {
    it('should calculate faction contribution as 10% of ambrosia', () => {
      const ambrosia = BigInt(1000);
      const contribution = service.calculateFactionXpContribution(ambrosia);
      
      expect(contribution).toBe(BigInt(100)); // 10% of 1000
    });
  });
});
