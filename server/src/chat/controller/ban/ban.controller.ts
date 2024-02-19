
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException } from '@nestjs/common';

import { BanService } from 'src/chat/service/ban/ban.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { Membership } from 'src/entity/membership.entity';
import { Room } from 'src/entity/room.entity';
import { UsersService } from 'src/users/users.service';

@Controller('ban')
export class BanController {

  constructor(
    private readonly banService: BanService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService,
    private readonly membershipService: MembershipService,
  ) {}

  @Get(':id')
  async getValid(@Param('id') roomId: string) {
    
    const room: Room = <Room> {roomId: roomId};
    return await this.banService.findBanRoomUser(room);
  }

  @Post()
  async createBan(
    @Body('userId') userId: string,
    @Body('targetId') targetId: string,
    @Body('roomId') roomId: string,
    @Body('duration') duration: number
  ) {

    if (!userId || !targetId || !roomId)
      throw new BadRequestException();

    // If the duration is not given it will def
    if (!duration || duration <= 0)
      duration = 300000 // 5 min

    const user = await this.userService.findById(userId);
    const target = await this.userService.findById(targetId);
    const room = await this.roomService.findRoom(roomId);

    if (!user || !target || !room)
      throw new NotFoundException();

    const targetMember = await this.membershipService.findMemberRoom(targetId, roomId);
    if (targetMember.owner)
      throw new UnauthorizedException('Owner cannot be banned');

    const ban = await this.banService.findBan(room, target);
    if (ban)
      throw new ConflictException("The user is already banned");

    const requestor: Membership = await this.membershipService
                                              .findMemberRoom(user.userId,
                                                              room.roomId);

    if (requestor.admin || requestor.owner) {
      await this.banService.createBan(target, room, duration);
      return "user banned";
    }
    else
      throw new UnauthorizedException("Not enough privileges to ban");
  }

  @Post('unban')
  async unbanUser(
    @Body('userId') userId: string,
    @Body('targetId') targetId: string,
    @Body('roomId') roomId: string,
  ) {
    if (!userId || !targetId || !roomId)
      throw new BadRequestException("Incomplete information");

    const user = await this.userService.findById(userId);
    const target = await this.userService.findById(targetId);
    const room = await this.roomService.findRoom(roomId);


    if (!user || !target || !room)
      throw new NotFoundException("Not found");

    const requestor: Membership = await this.membershipService.findMemberRoom(user.userId, room.roomId);
    const ban = await this.banService.findBan(room, target);

    if (!ban)
      throw new NotFoundException("The target user is not banned");

    if (requestor.admin || requestor.owner) {
      await this.banService.unban(ban);
      return "unban success";
    }
    else
      throw new UnauthorizedException("The requestor doesn't have enough privileges to unban");
  }
}
