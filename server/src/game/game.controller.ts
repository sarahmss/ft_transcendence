import { Body, ConflictException, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { EmissionToChatService } from './emissionToChat/emissionToChat.service';
import { GameInviteService } from 'src/chat/service/game-invite/game-invite.service';

@Controller('invitation')
export class GameController {
  constructor(
    private readonly userService: UsersService,
    private readonly chatEmitter: EmissionToChatService,
    private readonly gameInviteService: GameInviteService
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

    const workingInvitation = await this.gameInviteService.getInviteByUserPair(requestorId);
    if (workingInvitation)
      throw new ConflictException("An user can only issue one invite! Please wait...");

    
    const invitation = await this.gameInviteService.createInvite(playerOne, playerTwo);

    // Dados que os jogadores irao receber
    const sendDataToChatSocket = {
      requestorId: requestorId,
      userName: playerOne.userName,
      invitation: invitation.gameInviteId
    };


    // Emissor de eventos para o chat socket
    this.chatEmitter.emitDataToChatSocket(
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

  @Get(':userId')
  async getInvitation(@Param('userId') userId: string) {
    const inviteList = await this.gameInviteService.getInvitationList(userId);

    const inviteFormatted: any[] = inviteList.map((inv) => {
      return {
        gameRoomId: inv.inviterId,
        userType: inv.inviterId === userId
                    ? 'host' : 'guest',
        message: `Game invitation ${inv.inviterId === userId ? 'me': inv.inviter.userName}`
      }
    });

    return inviteFormatted;
  }

}
