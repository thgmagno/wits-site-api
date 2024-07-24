import { Test, TestingModule } from '@nestjs/testing';
import { UserActivitiesAnsweredService } from './user-activities-answered.service';
import { DatabaseModule } from '../../../database/database.module';
import { UserModule } from '../../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { UserScore } from '../../user-score/entity/user-score.entity';
import { UserScoreService } from '../../user-score/services/user-score.service';
import { UserScoreRepository } from '../../user-score/repository/user-score-repository';
import { UserRepository } from '../../user/repository/user.repository';
import { JWTProvider } from '../../user/providers/jwt.provider';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';
import { ActivityAlreadyAnsweredException } from '../domain/errors/ActivityAlreadyAnswered.exception';
import { WrongAnswerException } from '../domain/errors/WrongAnswer.exception';

describe('UserActivitiesAnsweredService', () => {
  let userActivitiesAnsweredService: UserActivitiesAnsweredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        UserModule,
        TypeOrmModule.forFeature([User, UserScore]),
      ],
      providers: [
        UserScoreService,
        UserScoreRepository,
        UserRepository,
        JWTProvider,
      ],
    }).compile();

    userActivitiesAnsweredService = module.get<UserActivitiesAnsweredService>(
      UserActivitiesAnsweredService,
    );
  });

  it('should not answer a question passing an user_id that does not exist', async () => {
    const user_id = 999;
    const activity_id = 1;
    const answer = '1';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);
    }).rejects.toThrow(UserNotFoundException);
  })

  it('should not answer a question passing an activity_id that does not exist', async () => {
    const user_id = 1;
    const activity_id = 999;
    const answer = '1';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);
    }).rejects.toThrow(ActivityNotFoundException);
  })

  it('should not answer a question that has already been answered', async () => {
    const user_id = 1;
    const activity_id = 1;
    const answer = '4';

    await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);
    }).rejects.toThrow(ActivityAlreadyAnsweredException);
  })

  it('should not answer a question with a wrong answer', async () => {
    const user_id = 1;
    const activity_id = 2;
    const answer = '5';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);
    }).rejects.toThrow(WrongAnswerException);
  })

  it('should answer a question with a correct answer', async () => {
    const user_id = 1;
    const activity_id = 2;
    const answer = '4';

    const result = await userActivitiesAnsweredService.answerQuestion(user_id, activity_id, answer);

    expect(result).toBe(true);
  })
});
