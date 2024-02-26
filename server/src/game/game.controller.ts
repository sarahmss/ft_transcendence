import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Res, UnauthorizedException } from '@nestjs/common';
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

    if (!requestorId || !secondPlayerId)
      throw new BadRequestException("Incomplete information given");

    const playerOne = await this.userService.findById(requestorId);
    const playerTwo = await this.userService.findById(secondPlayerId);
    if (!playerOne || !playerTwo)
      throw new NotFoundException("Either or both users don't exist");

    const workingInvitation = await this.gameInviteService.getInviteByUser(requestorId);
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

  @Post('useGameInvite')
  async useGameInvite(
    @Body('invitedId') invitedId: string,
    @Body('inviteId') inviteId: string) {
    
    const invite = await this.gameInviteService.getInvite(inviteId);

    if (!invite)
      throw new NotFoundException('Expired or not valid invitation');

    if (invite.invitedId !== invitedId)
      throw new UnauthorizedException('This invited it\'s not meant for this user');

    return 'ok';
  }

}
