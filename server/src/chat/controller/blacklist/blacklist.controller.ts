
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
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('blacklist')
export class BlacklistController {

  constructor(private readonly blackListService: BlacklistService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService) {}

  //Test endpoint
  @Get("valid")
  async getValid() {
    return await this.blackListService.getValid();
  }
  
  //Test endpoint
  @Get()
  async getAll() {
    return await this.blackListService.getAll();
  }

  //Single blackList
  @Post("single")
  async createBlackList(@Body('blockerId') blockerId: string,
    @Body('blockedId') blockedId: string,
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blockType === GLOBAL_BLOCK || blockType === LOCAL_BLOCK))
      throw new BadRequestException('Invalid block type.');

    if (!(blockerId && blockedId))
      throw new BadRequestException("Incomplete information given.");

    if (blockerId === blockedId)
      throw new BadRequestException("The blocker and the blocked are the same");

    const blockerUser = await this.userService.findById(blockerId);
    const blockedUser = await this.userService.findById(blockedId);

    if (!(blockedUser && blockerUser))
      throw new NotFoundException('The user provided or doesn\'t exist.');

    const roomTarget = await this.roomService.findRoom(roomId);
    if (blockType === LOCAL_BLOCK && !roomTarget)
      throw new BadRequestException("If the block it's local a room must be provided");

    const existingBlackList = await this.blackListService
                                          .checkExistence(blockerId,
                                                            blockedId,
                                                            roomId,
                                                            blockType)
    // Renew if there is an existing entry
    if (existingBlackList) {
      await this.blackListService
                  .updateDuration(
                    existingBlackList.blackListId, duration);

      return "blackList entry updated"
    }

    await this.blackListService.createBlackListEntry(
      blockerUser,
      blockedUser,
      roomTarget,
      blockType
    );
    return "blocked";
  }

  // Bulk blacklisting
  @Post("bulk")
  async createBlackListBulk(@Body('blockerId') blockerId: string,
    @Body('blockedIds') blockedIds: string[],
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number,
    @Body('duration') duration: number) {

    if (!(blockType === GLOBAL_BLOCK || blockType === LOCAL_BLOCK))
      throw new BadRequestException('Invalid block type.');

    const roomTarget = await this.roomService.findRoom(roomId);
    if (blockType === LOCAL_BLOCK && !roomTarget)
      throw new NotFoundException("Room Not found");

    if (!(blockedIds && blockedIds.length > 0 && blockerId))
      throw new BadRequestException("Incomplete information given");

    if (blockedIds.some((id) => (id === blockerId)))
      throw new BadRequestException("The blockler cannot block itself");
   
    const blocker = await this.userService.findById(blockerId);
    if (!blocker)
      throw new NotFoundException('User not found')

    const userList = new Set<User>();

    blockedIds.forEach(async (userId: string) => {
      const user = await this.userService.findById(userId);
      if (!user)
        throw new NotFoundException("User Not found");
      userList.add(user);
    });

    const existingBlackList = await this.blackListService
                                          .getBlockedByTheUser(blocker,roomTarget);

    const renewUsers = this.filterUser(
      existingBlackList,
      [...userList],
      true
    );

    const newEntryUsers = this.filterUser(
      [...userList],
      existingBlackList,
      false
    );

    await this.blackListService.updateDurationInBulk(renewUsers, duration);
    await this.blackListService.createInBulk(blocker, newEntryUsers, roomTarget, blockType);

    return "Bulk blocking done";
   }

  @Patch('unblock')
  async unblockBlackList(@Body('blockerId') blockerId: string,
    @Body('blockedIds') blockedId: string,
    @Body('roomId') roomId: string,
    @Body('blockType') blockType: number) {

    if (!(blockType === GLOBAL_BLOCK || blockType === LOCAL_BLOCK))
      throw new BadRequestException('Invalid block type.');

    if (!(blockedId && blockerId))
      throw new BadRequestException("Incomplete information given");

    if (blockType === LOCAL_BLOCK && isEmpty(roomId))
      throw new BadRequestException("Room level unblocking requires the roomId");

    const entry = await this.blackListService.checkExistence(
      blockerId,
      blockedId,
      roomId,
      blockType
    );

    if (!entry)
      throw new NotFoundException("Black list entry doesn\'t not exist");

    this.blackListService.unblockById(entry.blackListId);
    return "unblocked";
  }

  private filterUser(srcArray: any[], criteriaArray: any[], result: boolean) {

    return srcArray.filter((existingBlock: any) => {
       result === criteriaArray.some((user: any) => (
        user.userId === existingBlock.blockedId
      ))
    });

  }
}
