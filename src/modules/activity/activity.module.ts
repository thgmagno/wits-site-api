import { Module } from '@nestjs/common';
import { ActivityService } from './services/activity.service';
import { ActivityController } from './controller/activity.controller';

@Module({
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
