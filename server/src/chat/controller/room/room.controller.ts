import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { DIRECT, GROUP } from 'src/constants/roomType.constant';

@Controller('room')
export class RoomController {

	constructor (
		private readonly roomService: RoomService,
		private readonly membershipService: MembershipService,
		private readonly emitter: EventEmitter2)
	{}

	@Get('get_all')
	async getAllRoom () {
		return await this.roomService.getAll();
	}

	@Get('member_all')
	async getAllMemberShip() {
		return await this.membershipService.getAll();
	}

	@Get('list_room/:id')
	async getListRoom(@Param('id') userId: string) {
		let membershipList = await this.membershipService.findMemberRooms(userId);
		let roomList = [];
		for (let k = 0; k < membershipList.length; k++)
			roomList.push(await this.roomService.findRoom(membershipList[k].roomId));
		return roomList;
	}

	@Post()
	async createRoom(@Body() roomCreationData: RoomCreationData) {

		this.checkRoomCreationCondition(roomCreationData);
		let room = await this.roomService.createRoom(roomCreationData);
		this.membershipService.joinRoom(roomCreationData.user, room, roomCreationData.owner.userId);
		return room;
	}

	checkRoomCreationCondition(roomCreationData: RoomCreationData) {
		// Some checks before creating a room
		// User existence check
		if (!this.roomService.checkUser(roomCreationData.user))
			throw new NotFoundException();

		// The quantity of user in a room must be greater than 0
		if (!roomCreationData.user.length)
			throw new TypeError("The user list must have at least 1 user");

		if (roomCreationData.roomType === DIRECT &&
				roomCreationData.user.length != 2)
			throw new TypeError("Direct messaging should have only 2 participants")

		// Group chat must have a name
		if (roomCreationData.roomType == GROUP &&
				!roomCreationData.roomName)
			throw new TypeError("If the room it's a group a name is required");
	}
}
