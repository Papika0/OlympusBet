import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { FactionService } from './faction.service';
import { FactionType } from '@olympusbet/database';

@Controller('factions')
export class FactionController {
  constructor(private readonly factionService: FactionService) {}

  @Get()
  async getFactions() {
    return this.factionService.getFactions();
  }

  @Get('stats')
  async getFactionStats() {
    return this.factionService.getFactionStats();
  }

  @Get('war')
  async getActiveWar() {
    return this.factionService.getActiveWar();
  }

  @Get(':type')
  async getFaction(@Param('type') type: FactionType) {
    return this.factionService.getFaction(type);
  }

  @Get(':type/leaderboard')
  async getFactionLeaderboard(@Param('type') type: FactionType) {
    return this.factionService.getFactionLeaderboard(type);
  }

  @Post('join')
  async joinFaction(@Body() body: { userId: string; factionType: FactionType }) {
    return this.factionService.joinFaction(body.userId, body.factionType);
  }

  @Post('leave')
  async leaveFaction(@Body() body: { userId: string }) {
    return this.factionService.leaveFaction(body.userId);
  }
}
