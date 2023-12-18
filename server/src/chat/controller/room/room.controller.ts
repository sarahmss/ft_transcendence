import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';

@Controller('room')
export class RoomController {

	constructor (
		private readonly roomService: RoomService,
		private readonly membershipService: MembershipService) {}

	@Get('get_all')
	async getAllRoom () {
		return await this.roomService.getAll();
	}

	@Get('list_room/:id')
	async getListRoom(@Param('id') userId: string) {
		return await this.membershipService.findMemberRooms(userId);
	}

	@Post()
	async createRoom(@Body() roomCreationData: RoomCreationData) {
		let room = await this.roomService.createRoom(roomCreationData);
		this.membershipService.joinRoom(roomCreationData.user, room, roomCreationData.owner.userId);
		return room;
	}
}
