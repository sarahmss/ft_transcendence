import { BadRequestException, Body, Controller, Delete, NotFoundException, Post } from '@nestjs/common';
import { BanService } from 'src/chat/service/ban/ban.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { UsersService } from 'src/users/users.service';

@Controller('ban')
export class BanController {

  constructor(
    private readonly banService: BanService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService,
  ) {}

  @Post()
  async createBan(
    @Body('userId') userId: string,
    @Body('targetId') targetId: string,
    @Body('roomId') roomId: string,
    @Body('duration') duration: number
  ) {

    if (!userId || !targetId || !roomId)
      throw new BadRequestException();

    const user = await this.userService.findById(userId);
    const target = await this.userService.findById(targetId);
    const room = await this.roomService.findRoom(roomId);

    if (!user || !target || !roomId)
      throw new NotFoundException();

    await this.banService.createBan(target, room, duration);
  }

  @Delete()
  async unbanUser() {
  }
}
