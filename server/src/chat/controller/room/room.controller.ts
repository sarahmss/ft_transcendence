import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
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
		
		// Throw an exception if there is any error
		let exception = await this.checkRoomCreationCondition(roomCreationData);
		if (exception)
			throw exception;

		try {
			let room = await this.roomService.createRoom(roomCreationData);
			this.membershipService.joinRoom(roomCreationData.user,
				room,
				roomCreationData.owner.userId
			);
			return room;
		}
		catch {
			throw new InternalServerErrorException("Error when creating a room");
		}
	}

	// Some checks before creating a room
	// Transfer this section to a validation pipeline later
	private async checkRoomCreationCondition(roomCreationData: RoomCreationData) {

		// User existence check
		if (!(await this.roomService.checkUser(roomCreationData.user)))
			return new NotFoundException("Users not found");
		
		// The quantity of user in a room must be greater than 0
		if (!roomCreationData.user.length)
			return new BadRequestException("The user list must have at least 1 user");

		let uniqueId = Array.from(new Set(roomCreationData.user.map(user => user["userId"])));

		// The owner should be in the room to be able to join
		if (!uniqueId.find((id) => id === roomCreationData.owner.userId))
			return new BadRequestException("The owner must be a member");

		// Check if everyone is unique
		if (uniqueId.length !== roomCreationData.user.length)
			return new ConflictException("A user cannot enter in the same room multiple times");

		// Check direct messaging room
		if (roomCreationData.roomType === DIRECT) {
			// There should be only only 2 members
			if (roomCreationData.user.length != 2)
				return new BadRequestException("Direct messaging should have only 2 participants")

			// Check if the room already exists
			if (await this.membershipService.checkDirectRoomMembership(
						roomCreationData.user[0],
						roomCreationData.user[1]
					))
				return new ConflictException("This room already exists");
		}
		else {
			// Group chat must have a name
			if (roomCreationData.roomType == GROUP &&
					!roomCreationData.roomName)
				return new BadRequestException("If the room it's a group a name is required");
			
		}
				
	}
}
