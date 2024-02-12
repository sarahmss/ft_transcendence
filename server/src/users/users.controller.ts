import { Controller,
		ParseUUIDPipe,
		Get,
		Res,
		Body,
		Patch,
		Param,
		Delete,
		HttpCode,
		Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import {UpdateUserDto} from "./dto/user.dto";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		) {}

	/********************************* GET ******************************/
	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':userId/friends')
	async getFriends(@Param('userId', ParseUUIDPipe) userId: string) {
	  const friends = await this.usersService.GetFriends(userId);
	  return friends; 
	}

	@Get(':ownerId/friends/:friendId/status')
	async CheckFriendship(
	  @Param('ownerId', ParseUUIDPipe) ownerId: string,
	  @Param('friendId', ParseUUIDPipe) friendId: string,
	  @Res() res: any,
	) {
	  return this.usersService.getFriendshipStatus(ownerId, friendId, res);
	}
  
	@Get(':ownerId/friends/:friendId/remove')
	async RemoveFriend(
	  @Param('ownerId', ParseUUIDPipe) ownerId: string,
	  @Param('friendId', ParseUUIDPipe) friendId: string,
	  @Res() res: any,
	) {
	  return this.usersService.RemoveFriend(ownerId, friendId, res);
	}
  
	@Get(':ownerId/friends/:friendId/send-request')
	async SendFriendshipRequest(
	  @Param('ownerId', ParseUUIDPipe) ownerId: string,
	  @Param('friendId', ParseUUIDPipe) friendId: string,
	  @Res() res: any,
	) {
	  return this.usersService.SendFriendshipRequest(ownerId, friendId, res);
	}
  
	@Get(':ownerId/friends/:friendId/accept-request')
	async AcceptFriendshipRequest(
	  @Param('ownerId', ParseUUIDPipe) ownerId: string,
	  @Param('friendId', ParseUUIDPipe) friendId: string,
	  @Res() res: any,
	) {
	  return this.usersService.AcceptFriendshipRequest(ownerId, friendId, res);
	}
  
	@Get(':ownerId/friends/:friendId/deny-request')
	async DenyFriendshipRequest(
	  @Param('ownerId', ParseUUIDPipe) ownerId: string,
	  @Param('friendId', ParseUUIDPipe) friendId: string,
	  @Res() res: any,
	) {
	  return this.usersService.DenyFriendshipRequest(ownerId, friendId, res);
	}


	@Get('/AllStats')
	async getAllUserStats(): Promise<User[]> {
		return this.usersService.getAllUserStats();
	}

	@Get(':userId/stats')
	async getUserStats( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUserStats(userId);
	}

	@Get(':userId')
	async findById( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUser(userId);
	}

	@Get(':userId/profile')
	async getUserProfile( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUserProfile(userId);
	}

	/********************************* PATCH ******************************/

	@Patch(':userId')
	@HttpCode(204)
	async update (
				@Param('userId', ParseUUIDPipe) userId: string,
				@Body() userDto: UpdateUserDto): Promise<any> {
		return this.usersService.update(userId, userDto);
	}

	/********************************* DELETE ******************************/

	@Delete(':userId')
	async delete(@Param('userId') userId: string): Promise<any> {
		return this.usersService.delete(userId);
	}

	/********************************* POST ******************************/


}
