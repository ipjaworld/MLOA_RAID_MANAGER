import { Test, TestingModule } from '@nestjs/testing';
import { LostarkService } from './lostark.service';

describe('LostarkService', () => {
  let service: LostarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LostarkService],
    }).compile();

    service = module.get<LostarkService>(LostarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
