import { Test, TestingModule } from '@nestjs/testing';
import { LostarkController } from './lostark.controller';

describe('LostarkController', () => {
  let controller: LostarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LostarkController],
    }).compile();

    controller = module.get<LostarkController>(LostarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
