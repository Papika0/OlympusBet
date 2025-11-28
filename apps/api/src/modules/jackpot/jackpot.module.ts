import { Module } from '@nestjs/common';
import { JackpotService } from './jackpot.service';
import { JackpotController } from './jackpot.controller';

@Module({
  controllers: [JackpotController],
  providers: [JackpotService],
  exports: [JackpotService],
})
export class JackpotModule {}
