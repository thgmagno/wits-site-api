import { Module } from '@nestjs/common';
import { UserScoreService } from './services/user-score.service';
import { UserScoreController } from './controller/user-score.controller';

@Module({
  providers: [UserScoreService],
  controllers: [UserScoreController],
})
export class UserScoreModule {}
