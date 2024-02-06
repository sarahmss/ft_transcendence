import { Body, ConflictException, Controller, NotFoundException, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { InviteService } from 'src/chat/service/invite/invite.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { UsersService } from 'src/users/users.service';

@Controller('invite')
export class InviteController {

  constructor(
    private readonly inviteService: InviteService,
    private readonly roomService: RoomService,
    private readonly userService: UsersService,
    private readonly memberService: MembershipService,
  ) {}

  @Post()
  async createInvitation (
    @Body('requestorId') requestorId: string,
    @Body('roomId') roomId: string,
    @Body('userId') userId: string,
  ) {

    const requestorMembership = await this.memberService.findMemberRoom(requestorId, roomId);
    if (!requestorMembership)
      throw new UnauthorizedException('Requestor must be in the room');

    const userMembership = await this.memberService.findMemberRoom(userId, roomId);
    if (userMembership)
      throw new ConflictException('User it\'s already in the room');

    const room = await this.roomService.findRoom(roomId);
    const user = await this.userService.findById(userId);

    if (!room || !user)
      throw new NotFoundException('User or room not found');

    const rawInvitation = await this.inviteService.createInvitation(room, user);

    return {
      inviteId: rawInvitation.inviteId
    };
  }

  @Patch()
  async useInvitation (
    @Body('userId') userId: string,
    @Body('inviteId') inviteId: string
  ) {

    const invitation = await this.inviteService.findValid(inviteId);
    if (!invitation)
      throw new NotFoundException('Invitation not found');

    if (userId !== invitation.inviteId)
      throw new UnauthorizedException('Invation not meant for this user');

    await this.inviteService.useInvitation(inviteId);

    await this.memberService.joinSingleUser(invitation.user, invitation.room, false);
    return "invitation used";
  }
}
