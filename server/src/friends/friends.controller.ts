import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { FriendshipService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get(':userId')
  async getFriends(@Param('userId', ParseUUIDPipe) userId: string) {
    const friends = await this.friendshipService.GetFriends(userId);
    return friends; 
  }

  @Get(':ownerId/:friendId/status')
  async CheckFriendship(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    return this.friendshipService.getFriendshipStatus(ownerId, friendId, res);
  }
  
  @Get(':ownerId/:friendId/remove')
  async RemoveFriend(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    return this.friendshipService.RemoveFriend(ownerId, friendId, res);
  }
  
  @Get(':ownerId/:friendId/send-request')
  async SendFriendshipRequest(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    return this.friendshipService.SendFriendshipRequest(ownerId, friendId, res);
  }
  
  @Get(':ownerId/:friendId/accept-request')
  async AcceptFriendshipRequest(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    return this.friendshipService.AcceptFriendshipRequest(ownerId, friendId, res);
  }
  
  @Get(':ownerId/:friendId/deny-request')
  async DenyFriendshipRequest(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @Res() res: any,
  ) {
    return this.friendshipService.DenyFriendshipRequest(ownerId, friendId, res);
  }
}
