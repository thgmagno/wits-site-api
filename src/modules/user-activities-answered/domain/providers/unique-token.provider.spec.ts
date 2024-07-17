import { Test, TestingModule } from '@nestjs/testing';
import { UniqueTokenProvider } from './unique-token.provider';

describe('UniqueTokenProvider', () => {
  let provider: UniqueTokenProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueTokenProvider],
    }).compile();

    provider = module.get<UniqueTokenProvider>(UniqueTokenProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
