import { Body, ConflictException, Controller, NotFoundException, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { response } from 'express';
import { BanService } from 'src/chat/service/ban/ban.service';
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
    private readonly banService: BanService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post()
  async createInvitation (
    @Body('requestorId') requestorId: string,
    @Body('roomId') roomId: string,
    @Body('userId') userId: string,
  ) {

    if (await this.banService.checkBan(requestorId, roomId))
      throw new UnauthorizedException("The user is banned");

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

    this.eventEmitter.emit('invite-send',
      userId,
      rawInvitation.inviteId,
      "invitation-send"
    );

    return {
      inviteId: rawInvitation.inviteId
    };
  }

  @Patch()
  async useInvitation (
    @Body('userId') userId: string,
    @Body('inviteId') inviteId: string,
    @Body('response') response: boolean
  ) {

    const invitation = await this.inviteService.findValid(inviteId);
    if (!invitation)
      throw new NotFoundException('Invitation not found');

    if (userId !== invitation.userId)
      throw new UnauthorizedException('Invition not meant for this user');

    await this.memberService.joinSingleUser(invitation.user, invitation.room, false);
    await this.inviteService.useInvitation(inviteId, response);

    const memberList = this.memberService.findParticipantsNotExclusive(invitation.roomId);
    const roomId = invitation.roomId;
    const usr = this.userService.findById(invitation.userId);

    this.eventEmitter.emit("room.join",
      memberList,
      "",
      "joined",
      (_: any[], __: any, rid: string = roomId, user: any = usr) => {
        return ({
          userId: user.userId,
          userName: user.userName,
          profileImage: user.profilePicture,
          roomId: rid
        })
      }
    );
    return "invitation used";
  }

  @Post('getInvitation')
  async getInvitation (
    @Body('userId') userId: string,
  ) {
    return await this.inviteService.getInvitation(userId);
  }
}
