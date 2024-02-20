import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}


  @Get(':ownerId/:friendId/chat-match')
  async DenyFriendshipRequest(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    console.log("receive request to create room", ownerId, friendId);
    // this.gameService.createRoom()
    return 
  }
}
