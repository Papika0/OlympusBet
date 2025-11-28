import { Module } from '@nestjs/common';
import { GamificationModule } from './gamification/gamification.module';

/**
 * AppModule - Root module for the OlympusBet API
 * 
 * Inspired by the great temples of ancient Greece, this module
 * serves as the foundation upon which all other services are built.
 */
@Module({
  imports: [GamificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
