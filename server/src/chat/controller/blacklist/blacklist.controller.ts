
import { BadRequestException, Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post } from '@nestjs/common';
import { isEmpty } from 'class-validator';

import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { GLOBAL_BLOCK, LOCAL_BLOCK } from 'src/constants/blackListType.constant';
import { BlackList } from 'src/entity/blacklist.entity';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';

//If blockType it's not given the blackList will default to room level block

@Controller('blacklist')
export class BlacklistController {

  constructor(private readonly blackListService: BlacklistService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService) {}

  @Get("valid")
  async getValid() {
    return await this.blackListService.getValid();
  }
  
  @Get()
  async getAll() {
    return await this.blackListService.getAll();
  }

  //Single blackList
  @Post("single")
  async createBlackList(@Body('blockerId') blocker: string,
    @Body('blockedId') blocked: string,
    @Body('room') room: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blocker && blocked && room))
      throw new BadRequestException("Incomplete information given.");

    if (blocker === blocked)
      throw new BadRequestException("The blocker and the blocked are the same");

    blockType = this.setType(blockType);
    const existingBlackList = await this.blackListService
                                          .checkExistence(blocker,
                                                            blocked,
                                                            room,
                                                            blockType)
    // Renew if there is an existing entry
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
  @Post("bulk")
  async createBlackListBulk(@Body('blockerId') blockerId: string,
    @Body('blockedIds') blockedIds: string[],
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blockedIds.length > 0 && blockerId && roomId ))
      throw new BadRequestException("Incomplete information given");

    if (blockedIds.some((id) => (id === blockerId)))
      throw new BadRequestException("The blockler cannot block itself");
   
    const blocker = <User> await this.userService.findById(blockerId);
    if (!blocker)
      throw new NotFoundException('User not found')

    blockType = this.setType(blockType);

    const userList = new Set<User>();
    blockedIds.forEach(async (userId: string) => {
      const user = await this.userService.findById(userId);
      if (!user)
        throw new NotFoundException("User Not found");
      userList.add(user);
    });

    const roomTarget = await this.roomService.findRoom(roomId);
    
    if (!(roomTarget))
      throw new NotFoundException("Room Not found");

    const existingBlackList = await this.blackListService
                                          .getBlockedUser(blocker, roomTarget);

    const renewUsers = existingBlackList.filter((existingBlock: BlackList) => {
      [...userList].some((user: User) => (
        user.userId === existingBlock.blockedId
      ))
    });

    const newEntryUsers = [...userList].filter((user: User) => {
      !existingBlackList.some((blocked) => (
        user.userId === blocked.blockedId
      ))
    });

    this.blackListService.updateDurationInBulk(renewUsers, duration);

    this.blackListService.createInBulk(blocker, newEntryUsers, roomTarget, blockType);

    return "blocked in bulk";
   }

  @Patch('unblock')
  async unblockBlackList(@Body('blockerId') blockerId: string,
    @Body('blockedIds') blockedId: string,
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number) {

    if (!(blockedId && blockerId))
      throw new BadRequestException("Incomplete information given");

    if (blockType === LOCAL_BLOCK && isEmpty(roomId))
      throw new BadRequestException("Room level unblocking requires the roomId");

    blockType = this.setType(blockType);

    const entry = await this.blackListService.checkExistence(blockerId,
      blockedId,
      roomId,
      blockType);

    if (!entry)
      throw new NotFoundException("Black list entry doesn\'t not exist");

    this.blackListService.unblockById(entry.blackListId);
    return "unblocked";
  }

  private setType(roomType: number) {
    if (!roomType || !(roomType === LOCAL_BLOCK || roomType === GLOBAL_BLOCK))
      return LOCAL_BLOCK;
    return roomType;
  }
}
