import { Module } from '@nestjs/common';
import { GamificationModule } from './modules/gamification/gamification.module';
import { JackpotModule } from './modules/jackpot/jackpot.module';
import { ChatModule } from './modules/chat/chat.module';
import { FactionModule } from './modules/faction/faction.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';

@Module({
  imports: [
    GamificationModule,
    JackpotModule,
    ChatModule,
    FactionModule,
    AffiliateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
