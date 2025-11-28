import { Controller, Get, Query } from '@nestjs/common';
import { JackpotService } from './jackpot.service';

@Controller('jackpot')
export class JackpotController {
  constructor(private readonly jackpotService: JackpotService) {}

  @Get('current')
  async getCurrentJackpot() {
    return this.jackpotService.getCurrentJackpot();
  }

  @Get('history')
  async getJackpotHistory(@Query('limit') limit?: string) {
    return this.jackpotService.getJackpotHistory(
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
