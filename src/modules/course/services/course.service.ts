import { Injectable } from '@nestjs/common';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { CourseRepository } from '../repository/course.repository';
import { FindCoursesResponseDTO } from '../domain/requests/FindCourses.request.dto';
import { ActivityRepository } from '../../activity/repository/activity.repository';

@Injectable()
export class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly userCourseConcludedRepository: UserCourseConcludedRepository,
        private readonly activitiesRepository: ActivityRepository,
    )   {}

    async getCourses(): Promise<FindCoursesResponseDTO[]>    {
        const courses = await this.courseRepository.find();

        const coursesWithActivities = await Promise.all(courses.map(async course => {
            const totalOfActivities = await this.activitiesRepository.count({ where: { course_id: course.id_course } });

            return {
                ...course,
                total_of_activities: totalOfActivities,
            };
        }));

        return coursesWithActivities;
    }
}
