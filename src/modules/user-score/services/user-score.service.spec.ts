import { Test, TestingModule } from '@nestjs/testing';
import { UserScoreService } from './user-score.service';

describe('UserScoreService', () => {
  let service: UserScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScoreService],
    }).compile();

    service = module.get<UserScoreService>(UserScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
