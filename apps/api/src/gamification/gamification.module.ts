import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GamificationService } from './gamification.service';

/**
 * GamificationModule - The Odyssey Leveling System Module
 * 
 * This module encapsulates all gamification-related functionality,
 * including the Ambrosia (XP) system and rank progression.
 */
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
