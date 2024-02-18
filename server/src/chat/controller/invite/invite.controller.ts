import { Body, ConflictException, Controller, NotFoundException, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BanService } from 'src/chat/service/ban/ban.service';
import { InviteService } from 'src/chat/service/invite/invite.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { Invite } from 'src/entity/invite.entity';
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
      {
        invitationId: rawInvitation.inviteId,
        roomId: rawInvitation.roomId,
        roomName: rawInvitation.room.roomName
      },
      "invitation-send"
    );
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

    const member = await this.memberService.findMemberRoom(invitation.userId, invitation.roomId);
    if (member)
      throw new ConflictException('The user it\'s already in the room');

    await this.inviteService.useInvitation(inviteId, response);

    if (response) {

      this.inviteService.invalidate(invitation.userId, invitation.roomId);
      await this.memberService.joinSingleUser(invitation.user, invitation.room, false);
      const memberList = await this.memberService.findParticipantsNotExclusive(invitation.roomId);
      const roomId = invitation.roomId;
      const usr = await this.userService.findById(invitation.userId);

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
    }

    this.eventEmitter.emit('invitation-used',
      invitation.userId,
      invitation.roomId,
      "invitation-used"
    );
    return "invitation used";
  }

  @Post('getInvitation')
  async getInvitation (
    @Body('userId') userId: string,
  ) {
    const invitationRaw: Invite[] = await this.inviteService.getInvitation(userId);

    const inviteFormatted = invitationRaw.map((invite) => {
      return {
        roomName: invite.room.roomName,
        roomId: invite.roomId,
        invitationId: invite.inviteId
      };
    });

    return inviteFormatted;
    
  }
}
