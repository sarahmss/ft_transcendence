import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { Membership } from 'src/entity/membership.entity';

@Controller('room')
export class RoomController {

	constructor (
		private readonly roomService: RoomService,
		private readonly membershipService: MembershipService) {}

	@Get()
	async getListRoom(@Body('member') member: Membership) {
		// the service will get everything
		return await this.roomService.getListRoomByMember(member);
	}

	@Post()
	async createRoom(@Body() roomCreationData: RoomCreationData) {
		let room = await this.roomService.createRoom(roomCreationData);
		this.membershipService.joinRoom(roomCreationData.user, room, roomCreationData.owner.userId);
	}
}
