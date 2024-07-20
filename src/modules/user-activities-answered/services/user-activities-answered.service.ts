import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { UserActivityAnsweredRepository } from '../repository/user-activities-answered.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { WrongAnswerException } from '../domain/errors/WrongAnswer.exception';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';
import { ActivityAlreadyAnsweredException } from '../domain/errors/ActivityAlreadyAnswered.exception';

@Injectable()
export class UserActivitiesAnsweredService {
    constructor(
        private readonly userActivitiesAnsweredRepository: UserActivityAnsweredRepository,
        private readonly activitiesRepository: ActivityRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async answerQuestion(user_id: number, activity_id: number, answer: string): Promise<true | WrongAnswerException | ActivityAlreadyAnsweredException | UserNotFoundException> {
        const userExists = await this.userRepository.findOne({ where: { id_user: user_id } });

        if (!userExists) throw new UserNotFoundException();

        const activityExists = await this.activitiesRepository.findOne({ where: { id_activity: activity_id } });

        if (!activityExists) throw new ActivityNotFoundException();

        const activityHasAlreadyBeenAnswered = await this.userActivitiesAnsweredRepository.findOne({
            where: {
                activity_id,
                user_id,
            }
        })

        if (activityHasAlreadyBeenAnswered) throw new ActivityAlreadyAnsweredException();

        const isCorrect = activityExists.correct_answer === answer;

        if (!isCorrect) throw new WrongAnswerException();

        await this.userActivitiesAnsweredRepository.save({
            user_id,
            activity_id
        });

        return true
    }
}
