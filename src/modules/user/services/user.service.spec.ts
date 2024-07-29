import { Test, TestingModule } from '@nestjs/testing';
import { UserClearingService, UserService } from './user.service';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../course/entity/course.entity';
import { Activity } from '../../activity/entity/activity.entity';
import { UserCourseConcluded } from '../../user-courses-concluded/entity/user-courses-concluded.entity';
import { UserActivityAnswered } from '../../user-activities-answered/entity/user-activities-answered.entity';
import { UserScore } from '../../user-score/entity/user-score.entity';
import { HashProvider } from '../providers/hash.provider';
import { JWTProvider } from '../providers/jwt.provider';
import { CreateUserDTO } from '../dto/user.dto';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { UserRepository } from '../repository/user.repository';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { UsernameAlreadyRegisteredException } from '../domain/errors/UsernameAlreadyRegistered.exception';
import { InvalidCredentialsException } from '../domain/errors/InvalidCredentials.exception';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { UserScoreRepository } from '../../user-score/repository/user-score-repository';

describe('UserService Test Suites', () => {
  let userService: UserService;
  let userClearingService: UserClearingService;

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] })
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          Activity,
          Course,
          UserCourseConcluded,
          UserActivityAnswered,
          UserScore,
        ]),
      ],
      providers: [
        UserService,
        JWTProvider,
        HashProvider,
        UserRepository,
        UserClearingService,
        UserScoreRepository
      ],
      exports: [JWTProvider, HashProvider, UserService, UserClearingService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userClearingService = module.get<UserClearingService>(UserClearingService);
  });

  it('should not create an user with an e-mail with more than 50 characters', async () => {
    const user: CreateUserDTO = {
      email:
        'fulaninhodasilvamuitobacanaestoupreenchendocaracteresatoa@gmaaaaaaaaail.com',
      password: '@TestandoAlguma_Coisa_123456',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with an e-mail with less than 10 characters', async () => {
    const user: CreateUserDTO = {
      email: 'a@oi.com',
      password: '@TestandoAlguma_Coisa_123456',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with an email without a domain', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva',
      password: '@TestandoAlguma_Coisa_123456',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with an e-mail without a username', async () => {
    const user: CreateUserDTO = {
      email: '@gmail.com',
      password: '@TestandoAlguma_Coisa_123456',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a candidate with an uncompleted domain', async () => {
    const user: CreateUserDTO = {
      email: 'fulano@com',
      password: '@TestandoAlguma_Coisa_123456',
      username: 'fulaninho',
    };
    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password with less then 15 characters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: '1234',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password with more than 50 characters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password:
        'Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password without letters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: '1234@4125@@',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password without numbers', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'abcdfg@@)$(@)$',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password without at least one capital letter', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'abcdfg@@)$(@412412)$',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password without special characters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'abcdfgh21124981024',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a password without at least one minor letter', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: '1131313@@@TESTEEEE',
      username: 'fulaninho',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with an username with less than 5 characters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'f',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with an username with more than 15 characters', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'fffffffffffffffffffffffffffffffffffffffffffffffff',
    };

    expect(async () => {
      await userService.register(user);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an user with a duplicated e-mail', async () => {
    const user: CreateUserDTO = {
      email: 'fulaninhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'fulano1',
    };

    await userService.register(user).finally(async () => {
      expect(async () => {
        await userService.register({
          email: 'fulaninhodasilva@gmail.com',
          password: 'SenhaDoFulano123@1@!@',
          username: 'fulano2',
        });
      }).rejects.toThrow(EmailAlreadyRegisteredException);
    });
  });

  it('should not create an user with a duplicated username', async () => {
    const user: CreateUserDTO = {
      email: 'zezinhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'fulano2',
    };

    await userService.register(user).finally(async () => {
      expect(async () => {
        await userService.register({
          email: 'fulaninhodasilva@gmail.com',
          password: 'SenhaDoFulano123@1@!@',
          username: 'fulano2',
        });
      }).rejects.toThrow(UsernameAlreadyRegisteredException);
    });
  });

  it('should create an user given the valid credentials', async () => {
    const user: CreateUserDTO = {
      email: 'joaozinhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'joaozinho',
    };

    await userService.register(user).then(async (response) => {
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('user');
    });
  });

  it('should not login an user given the wrong username', async () => {
    const user: CreateUserDTO = {
      email: 'joaozinhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'joaozinho',
    };

    expect(async () => {
      await userService.login({
        username: 'joaozinho_errado',
        inserted_password: user.password,
      });
    }).rejects.toThrow(InvalidCredentialsException);
  });

  it('should not login an user given the wrong password', async () => {
    const user: CreateUserDTO = {
      email: 'joaozinhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'joaozinho',
    };

    expect(async () => {
      await userService.login({
        username: user.username,
        inserted_password: 'SenhaErrada123@1@!@',
      });
    }).rejects.toThrow(InvalidCredentialsException);
  });

  it('should login an user given the valid credentials', async () => {
    const user: CreateUserDTO = {
      email: 'joaozinhodasilva@gmail.com',
      password: 'SenhaDoFulano123@1@!@',
      username: 'joaozinho',
    };

    await userService
      .login({
        username: user.username,
        inserted_password: user.password,
      })
      .then(async (response) => {
        expect(response).toHaveProperty('token');
        expect(response).toHaveProperty('user');
      });
  });

  it('should throw an error when trying to use home data with an unexiting user id', async () => {
    expect(async () => {
      await userService.homeData(0);
    }).rejects.toThrow(UserNotFoundException);
  });

  it('should bring the home data of an user given the valid id', async () => {
    await userService.homeData(2).then(async (response) => {
      expect(response).toHaveProperty('user');
    });
  });
});
