import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { Rank } from '@olympusbet/database';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('progress/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.gamificationService.getUserProgress(userId);
  }

  @Get('ranks')
  getAllRanks() {
    return this.gamificationService.getAllRankInfo();
  }

  @Get('ranks/:rank')
  getRankInfo(@Param('rank') rank: Rank) {
    return this.gamificationService.getRankInfo(rank);
  }

  @Get('leaderboard')
  async getLeaderboard(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.gamificationService.getLeaderboard(
      limit ? parseInt(limit, 10) : 100,
      offset ? parseInt(offset, 10) : 0,
    );
  }
}
