import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import { Activity } from '../entity/activity.entity';
import { CourseNotFoundException } from '../../course/domain/errors/CourseNotFound.exception';
import { CourseRepository } from '../../course/repository/course.repository';
import { CreateActivityRequestDTO, CreateActivityResponseDTO } from '../domain/requests/CreateActivity.request.dto';

@Injectable()
export class ActivityService {
    constructor(
        private readonly activityRepository: ActivityRepository,
        private readonly courseRepository: CourseRepository,
    ) {}

    async getActivities(course_id: number): Promise<Activity[]> {
        return await this.activityRepository.find({
            where: { course_id },
            order: { created_at: 'ASC' },
        });
    }

    async createActivity(activityData: CreateActivityRequestDTO): Promise<CreateActivityResponseDTO | CourseNotFoundException> {
        const course = await this.courseRepository.findOne({
            where: { id_course: activityData.course_id },
        });

        if (!course) throw new CourseNotFoundException();

        return {
            ...await this.activityRepository.save(activityData)
        }
    }
}
