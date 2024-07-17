import { Module } from '@nestjs/common';
import { CourseController } from './controller/course.controller';
import { CourseService } from './services/course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
