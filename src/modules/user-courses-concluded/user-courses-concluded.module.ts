import { Module } from '@nestjs/common';
import { UserCoursesConcludedDtoService } from './services/user-courses-concluded.dto.service';

@Module({
  providers: [UserCoursesConcludedDtoService]
})
export class UserCoursesConcludedModule {}
