/**
 * AgoraService - Chat and Crypto Rain System
 * 
 * Handles chat-related functionality including:
 * - Crypto rain distribution
 * - Rain claim validation
 * - Chat room management
 */

import {
  CRYPTO_RAIN_MIN_AMOUNT,
  CRYPTO_RAIN_MAX_CLAIMS,
  CRYPTO_RAIN_DURATION_MINUTES,
} from '../constants/gamification';

export interface CryptoRainConfig {
  totalAmount: bigint;
  maxClaims: number;
  durationMinutes: number;
}

export interface CryptoRainCreationResult {
  amountPerClaim: bigint;
  maxClaims: number;
  expiresAt: Date;
  isValid: boolean;
  validationError?: string;
}

export interface RainClaimResult {
  success: boolean;
  amount: bigint;
  error?: string;
}

export class AgoraService {
  /**
   * Validate and calculate crypto rain distribution
   */
  createCryptoRain(config: CryptoRainConfig): CryptoRainCreationResult {
    const { totalAmount, maxClaims, durationMinutes } = config;
    
    // Validate minimum amount
    if (totalAmount < CRYPTO_RAIN_MIN_AMOUNT) {
      return {
        amountPerClaim: BigInt(0),
        maxClaims: 0,
        expiresAt: new Date(),
        isValid: false,
        validationError: `Minimum rain amount is ${CRYPTO_RAIN_MIN_AMOUNT.toString()}`,
      };
    }
    
    // Validate max claims
    const effectiveMaxClaims = Math.min(maxClaims, CRYPTO_RAIN_MAX_CLAIMS);
    if (effectiveMaxClaims < 1) {
      return {
        amountPerClaim: BigInt(0),
        maxClaims: 0,
        expiresAt: new Date(),
        isValid: false,
        validationError: 'Max claims must be at least 1',
      };
    }
    
    // Calculate amount per claim
    const amountPerClaim = totalAmount / BigInt(effectiveMaxClaims);
    if (amountPerClaim < BigInt(1)) {
      return {
        amountPerClaim: BigInt(0),
        maxClaims: 0,
        expiresAt: new Date(),
        isValid: false,
        validationError: 'Amount per claim is too small',
      };
    }
    
    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (durationMinutes || CRYPTO_RAIN_DURATION_MINUTES));
    
    return {
      amountPerClaim,
      maxClaims: effectiveMaxClaims,
      expiresAt,
      isValid: true,
    };
  }

  /**
   * Check if a rain is still active and claimable
   */
  isRainActive(expiresAt: Date, claimedCount: number, maxClaims: number): boolean {
    const now = new Date();
    return now < expiresAt && claimedCount < maxClaims;
  }

  /**
   * Validate a rain claim
   */
  validateClaim(
    rainExpiresAt: Date,
    rainClaimedCount: number,
    rainMaxClaims: number,
    userHasClaimed: boolean
  ): RainClaimResult {
    if (userHasClaimed) {
      return {
        success: false,
        amount: BigInt(0),
        error: 'You have already claimed this rain',
      };
    }
    
    if (!this.isRainActive(rainExpiresAt, rainClaimedCount, rainMaxClaims)) {
      return {
        success: false,
        amount: BigInt(0),
        error: 'This rain has expired or is fully claimed',
      };
    }
    
    return {
      success: true,
      amount: BigInt(0), // Amount should be set by caller based on rain config
    };
  }

  /**
   * Get default rain configuration
   */
  getDefaultRainConfig(): Partial<CryptoRainConfig> {
    return {
      maxClaims: CRYPTO_RAIN_MAX_CLAIMS,
      durationMinutes: CRYPTO_RAIN_DURATION_MINUTES,
    };
  }

  /**
   * Get minimum rain amount
   */
  getMinimumRainAmount(): bigint {
    return CRYPTO_RAIN_MIN_AMOUNT;
  }

  /**
   * Get maximum claims per rain
   */
  getMaxClaimsPerRain(): number {
    return CRYPTO_RAIN_MAX_CLAIMS;
  }

  /**
   * Get default rain duration in minutes
   */
  getDefaultRainDuration(): number {
    return CRYPTO_RAIN_DURATION_MINUTES;
  }
}

export const agoraService = new AgoraService();
