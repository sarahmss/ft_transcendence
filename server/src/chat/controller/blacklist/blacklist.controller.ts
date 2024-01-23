
import { BadRequestException, Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post } from '@nestjs/common';
import { validateHeaderName } from 'http';

import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { GLOBAL_BLOCK, LOCAL_BLOCK } from 'src/constants/blackListType.constant';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';

//If blockType it's not given the blackList will default to room level block

@Controller('blacklist')
export class BlacklistController {

  constructor(private readonly blackListService: BlacklistService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService) {}

  //Single blackList
  @Post()
  async createBlackList(@Body('blockerId') blocker: string,
    @Body('blockedId') blocked: string,
    @Body('room') room: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blocker && blocked && room))
      throw new BadRequestException("Incomplete information given.");

    const existingBlackList = await this.blackListService
                                          .checkExistence(blocker,
                                                            blocked,
                                                            room,
                                                            blockType)
    if (existingBlackList) {

      await this.blackListService
                  .updateDuration(
                    existingBlackList.blackListId, duration);
      return "blackList entry updated"
    }

    else {
      const blockerUser = <User> await this.userService.findById(blocker);
      const blockedUser = <User> await this.userService.findById(blocked);
      const roomTarget = await this.roomService.findRoom(room);

      if (!(blockedUser && blockerUser && roomTarget))
        throw new NotFoundException('The user provided or room doesn\'t exist.');

      if (!(blockType == GLOBAL_BLOCK || blockType == LOCAL_BLOCK))
        throw new BadRequestException('Invalid block type.');
    
      await this.blackListService.createBlackListEntry(blockerUser, blockedUser, roomTarget, blockType);
      return "blocked";
      
    }
  }

  // Bulk blacklisting
  @Post()
  async createBlackListBulk(@Body('blockerId') blockerId: string,
    @Body('blockedIds') blockedIds: string[],
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blockedIds.length > 0 && blockerId && roomId ))
      throw new BadRequestException("Incomplete information given");
   
    const blocker = <User> await this.userService.findById(blockerId);

    const userList = new Set<User>();
    blockedIds.forEach(async (userId: string) => {
      const user = await this.userService.findById(userId);
      if (!user)
        throw new NotFoundException("User Not found");
      userList.add(user);
    });

    const roomTarget = await this.roomService.findRoom(roomId);
    
    if (!(roomTarget))
      throw new NotFoundException("room Not found");

    this.blackListService.createInBulk(blocker, userList, roomTarget, blockType);
   }
}
