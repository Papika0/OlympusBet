import { Injectable } from '@nestjs/common';
import { AgoraService as SharedAgoraService, CryptoRainConfig } from '@olympusbet/shared';
import { prisma, MessageType } from '@olympusbet/database';

/**
 * NestJS wrapper for the Agora Chat Service
 */
@Injectable()
export class ChatService {
  private sharedService: SharedAgoraService;

  constructor() {
    this.sharedService = new SharedAgoraService();
  }

  /**
   * Get or create the main chat room
   */
  async getMainRoom() {
    let room = await prisma.chatRoom.findFirst({
      where: { name: 'The Agora' },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          name: 'The Agora',
          description: 'The main gathering place for all Olympians',
          isPublic: true,
        },
      });
    }

    return room;
  }

  /**
   * Get chat rooms
   */
  async getRooms() {
    return prisma.chatRoom.findMany({
      where: { isPublic: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get messages for a room
   */
  async getMessages(roomId: string, limit: number = 50, before?: string) {
    return prisma.chatMessage.findMany({
      where: {
        roomId,
        isDeleted: false,
        ...(before ? { id: { lt: before } } : {}),
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true, rank: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Send a message
   */
  async sendMessage(roomId: string, userId: string, content: string, type: MessageType = MessageType.TEXT) {
    return prisma.chatMessage.create({
      data: {
        roomId,
        userId,
        content,
        type,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true, rank: true },
        },
      },
    });
  }

  /**
   * Create a crypto rain
   */
  async createCryptoRain(
    roomId: string,
    senderId: string,
    config: CryptoRainConfig
  ) {
    const result = this.sharedService.createCryptoRain(config);

    if (!result.isValid) {
      throw new Error(result.validationError);
    }

    // Verify sender has sufficient balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId: senderId },
    });

    if (!wallet || wallet.balance < config.totalAmount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from sender's wallet
    await prisma.wallet.update({
      where: { userId: senderId },
      data: { balance: { decrement: config.totalAmount } },
    });

    // Create rain record
    const rain = await prisma.cryptoRain.create({
      data: {
        roomId,
        senderId,
        totalAmount: config.totalAmount,
        amountPerClaim: result.amountPerClaim,
        maxClaims: result.maxClaims,
        expiresAt: result.expiresAt,
        isActive: true,
      },
    });

    return rain;
  }

  /**
   * Claim crypto rain
   */
  async claimRain(rainId: string, userId: string) {
    const rain = await prisma.cryptoRain.findUnique({
      where: { id: rainId },
      include: {
        claims: { where: { userId } },
      },
    });

    if (!rain) {
      throw new Error('Rain not found');
    }

    const validation = this.sharedService.validateClaim(
      rain.expiresAt,
      rain.claimedCount,
      rain.maxClaims,
      rain.claims.length > 0
    );

    if (!validation.success) {
      throw new Error(validation.error);
    }

    // Create claim and update rain
    const [claim] = await prisma.$transaction([
      prisma.cryptoRainClaim.create({
        data: {
          rainId,
          userId,
          amount: rain.amountPerClaim,
        },
      }),
      prisma.cryptoRain.update({
        where: { id: rainId },
        data: {
          claimedCount: { increment: 1 },
          isActive: rain.claimedCount + 1 < rain.maxClaims,
        },
      }),
      prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: rain.amountPerClaim } },
      }),
    ]);

    return claim;
  }

  /**
   * Get active rains in a room
   */
  async getActiveRains(roomId: string) {
    return prisma.cryptoRain.findMany({
      where: {
        roomId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });
  }
}
