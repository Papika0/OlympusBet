import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('tiers')
  getAllTiers() {
    return this.affiliateService.getAllTiers();
  }

  @Get(':userId/stats')
  async getAffiliateStats(@Param('userId') userId: string) {
    return this.affiliateService.getAffiliateStats(userId);
  }

  @Get(':userId/code')
  async getAffiliateCode(@Param('userId') userId: string) {
    return this.affiliateService.getAffiliateCode(userId);
  }

  @Get(':userId/referrals')
  async getReferrals(@Param('userId') userId: string) {
    return this.affiliateService.getReferrals(userId);
  }

  @Post('register')
  async registerWithAffiliateCode(
    @Body() body: { userId: string; affiliateCode: string },
  ) {
    return this.affiliateService.registerWithAffiliateCode(
      body.userId,
      body.affiliateCode,
    );
  }
}
