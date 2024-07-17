import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CourseController } from './controller/course.controller';
import { CourseService } from './services/course.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entity/activity.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Activity,
      User
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
