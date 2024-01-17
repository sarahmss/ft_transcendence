import { Test, TestingModule } from '@nestjs/testing';
import { HideMessageService } from './hide-message.service';

describe('HideMessageService', () => {
  let service: HideMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HideMessageService],
    }).compile();

    service = module.get<HideMessageService>(HideMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
