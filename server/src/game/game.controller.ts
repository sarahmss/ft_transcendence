import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post('invite')
  async createInvitationGameRoom(
    @Body('requestorId') requestorId : string,
    @Body('secondPlayerId') secondPlayerId :string
  ) {

    const playerOne = await this.userService.findById(requestorId);
    const playerTwo = await this.userService.findById(secondPlayerId);
    if (!playerOne || !playerTwo)
      throw new NotFoundException("Either or both users don't exist");

    
    // Dados que os jogadores irao receber
    const sendDataToChatSocket = {
      requestorId: requestorId,
      userName: playerOne.userName,
    }

    // Emissor de eventos para o chat socket
    this.emitDataToChatSocket(
      'game.invitation.send',
      [requestorId, secondPlayerId],
      sendDataToChatSocket,
      'game-invitation'
    );
  }

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

  private emitDataToChatSocket (
    event: string,
    recipients: string[],
    data: any,
    emission_event: string,
  ) {

    const cb = (userId: string, __: any, sendData: any = data) => {
        return ({
          gameRoomId: sendData.requestorId,
          userType: sendData.requestorId === userId
                      ? 'host' : 'guest',
          message: `Game Invitation: ${sendData.requestorId === userId ? 'me' : sendData.userName}`,
        })
      };
    
    this.eventEmitter.emit(event,
      recipients,
      "",
      emission_event,
      cb
    );
  }

}
