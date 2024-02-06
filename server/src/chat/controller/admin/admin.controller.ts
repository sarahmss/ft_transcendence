import { BadRequestException, Body, Controller, NotFoundException, Patch, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { Membership } from 'src/entity/membership.entity';

@Controller('admin')
export class AdminController {

  constructor (
    private readonly membershipService: MembershipService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Patch ()
  async toggleAdmin (
    @Body('requestorId') requestorId: string,
    @Body('userId') userId: string,
    @Body('roomId') roomId: string
  ) {

    if (!requestorId || !userId || !roomId)
      throw new BadRequestException("Required information not given");

    if (userId === requestorId)
      throw new BadRequestException("Requestor and targer member are the same");

    const requestor = await this.membershipService.findMemberRoom(requestorId, roomId);
    const member = await this.membershipService.findMemberRoom(userId, roomId);

    if (!member || !requestor)
      throw new NotFoundException('Member not found');

    if (!requestor.admin && !requestor.owner)
      throw new UnauthorizedException("Not enough privileges to give admin permission");

    await this.membershipService.toggleAdmin(member, roomId);

    const members = await this.membershipService.findParticipantsNotExclusive(roomId);
    this.eventEmitter.emit(
      "room.admin",
      members,
      member.roomId,
      "admin-toggle",
      (_: any, roomId: string, constant: any = member) => {
        return {
          userId: member.userId,
          roomId: roomId,
          admin: !member.admin
        };
      }
    );

  }
}
