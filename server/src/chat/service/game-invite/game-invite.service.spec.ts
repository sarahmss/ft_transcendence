import { Test, TestingModule } from '@nestjs/testing';
import { GameInviteService } from './game-invite.service';

describe('GameInviteService', () => {
  let service: GameInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInviteService],
    }).compile();

    service = module.get<GameInviteService>(GameInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
