
import { BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Patch,
	Post,
	UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RoomCreationData, RoomJoinData } from 'src/chat/dto/room.dto';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { GroupRoom, Room } from 'src/entity/room.entity';
import { RoomService } from 'src/chat/service/room/room.service';

import { DIRECT, GROUP } from 'src/constants/roomType.constant';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';


@Controller('room')
export class RoomController {

	constructor (
		private readonly roomService: RoomService,
		private readonly membershipService: MembershipService,
		private readonly userService: UsersService,
		private readonly eventEmitter: EventEmitter2)
	{}

	// Test endpoint
	@Get('get_all')
	async getAllRoom () {
		return await this.roomService.getAll();
	}

	// Test endpoint
	@Get('member_all')
	async getAllMemberShip() {
		return await this.membershipService.getAll();
	}

	@Post('list_room')
	async getListRoom(@Body('userId') userId: string) {
		if (!userId)
			throw new BadRequestException("User id not given");
		
		let membershipList = await this.membershipService.findMemberRoomsWithJoinRoom(userId);
		let roomList = [];

		for (let k = 0; k < membershipList.length; k++) {
			let room: any = membershipList[k].room;

			switch (room.roomType) {
				case DIRECT:
					const otherUser = (await this.membershipService.findParticipantsWithUserLeftJoin(room.roomId, userId))[0];
					room.roomName = otherUser.user.userName;
					break;
				case GROUP:
					const groupRoom = (await this.roomService.findGroup(room.roomId));
					room.isProtected = groupRoom.protected;
					break;
			}
			roomList.push(room);
		}
		return roomList;
	}

	@Delete()
	async deleteRoom(@Body('roomId') roomId: string) {
		if (!roomId)
			throw new BadRequestException("Required information not given");
		
		let room = await this.roomService.findRoom(roomId);
		if (!room)
			throw new NotFoundException("Room not found");
		const members = await this.membershipService.findParticipantsNotExclusive(roomId); 
		await this.roomService.deleteRoom(room);
		this.eventEmitter.emit('room.delete', members, room, "delete", (__: any, _:any) => {return {}});
	}

	@Delete('leave')
	async leaveRoom(
		@Body('roomId') roomId: string,
		@Body('userId') userId: string){

		if (!roomId || !userId)
			throw new BadRequestException("Required information not given");
		let user = await this.userService.findById(userId);
		let room = await this.roomService.findRoom(roomId);
		if (!room || !user)
			throw new NotFoundException("Room not found");

		const member = await this.membershipService.findMemberRoom(userId, roomId);
		if (member)
			throw new NotFoundException("The user was not found in this room");

		await this.membershipService.leaveRoom(userId, roomId);
		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);
		this.eventEmitter.emit('room.leave', memberList, room, "left",
			(_: any, room : Room, user_leave: User = user) => {
				return {
					message: `User ${user_leave.userName} left`,
					userName: user_leave.userName,
					userId: user_leave.userId,
					room: room,
					roomId: room.roomId
				}
			}
		);
		return "user left";
	}

	@Post()
	async createRoom(@Body() roomCreationData: RoomCreationData) {
		let exception = await this.checkRoomCreationCondition(roomCreationData);
		if (exception)
			throw exception;
		
		try {
			const userList = [];

			for (let i: number = 0; i < roomCreationData.userId.length; i++) {
				let user = await this.userService.findById(roomCreationData.userId[i]);
				console.log(user);

				if (user)
					userList.push(user);

				else
					throw new NotFoundException('User not found');
			}
			let room = await this.roomService.createRoom(roomCreationData);
			await this.membershipService.joinRoom(
				userList,
				room,
				roomCreationData.ownerId
			);

			this.eventEmitter.emit('room.create', roomCreationData.userId, room, "joined",
				(userId: string, room: Room ) => {
					return {
						userId: userId,
						roomId: room.roomId,
					}
				}
			);
			return room;
		}
		catch ( error ) {
			throw error;
		}
	}

	@Post('join')
	async joinRoom(@Body('userJoin') userJoin: RoomJoinData) {
		const room: Room = await this.roomService.findRoom(userJoin.roomId);
		const user: User = await this.userService.findById(userJoin.userId);
		let exception = await this.checkRoomJoinCondition(userJoin, room, user);

		if (exception)
			throw exception;

		try {
			this.membershipService.joinSingleUser(user, room, false);
			const  memberList = await this.membershipService.findParticipantsNotExclusive(room.roomId);
			this.eventEmitter.emit('room.join', memberList, userJoin.userId, room, "joined",
				(_: any, __: any, member: User = user) => {
					return {
						userName: member.userName,
						userId: member.userId,
						message: `User: ${member.userName}, joined`,
						room: room
					};
				}
			);
			return "User Joined"
		}
		catch (error) {
			throw error;
		}
	}

	@Patch('set_pass')
	async setPassword(
		@Body('userId') requestorId: string,
		@Body('password') password: string,
		@Body('roomId') roomId: string) {

		if (!requestorId || !password || !roomId )
			throw new BadRequestException('Required information not given');

		const exception = await this.permissionCheck(requestorId, roomId);
		if (exception)
			throw exception;

		await this.roomService.setPassRoom(password, roomId);
		return "Password set";
	}

	@Patch('unset_pass')
	async unsetPassword(
		@Body('userId') requestorId: string,
		@Body('roomId') roomId: string) {

		if (!requestorId || !roomId)
			throw new BadRequestException('Required information not given');

		const exception = await this.permissionCheck(requestorId, roomId);
		if (exception)
			throw exception

		await this.roomService.unsetPassRoom(roomId);
		return "password removed";
	}

	@Patch('toggle_private')
	async togglePrivate(
		@Body('userId') requestorId: string,
		@Body('roomId') roomId: string
	) {

		if (!requestorId || !roomId)
			throw new BadRequestException('Required information not given');

		const exception = await this.permissionCheck(requestorId, roomId);
		if (exception)
			throw exception

		const status = await this.roomService.togglePrivate(roomId);
		return `group chat visibily toggle: ${status ? "private": "public"}`;
		
	}

	private async permissionCheck (requestorId: string, roomId: string) {
		let member = await this.membershipService.findMemberRoom(requestorId, roomId);
		if (!member || !(member.admin || member.owner))
			return new UnauthorizedException("Requestor doesn't have enough rights or doesn't belong to the room");

		const room = await this.roomService.findRoom(roomId);

		if (!room)
			return new NotFoundException("Room not found.");

		if (room.roomType == DIRECT)
			return new BadRequestException("This operation it's not available in direct chat room");
		
	}

	private async checkRoomJoinCondition(userJoin: RoomJoinData, room: Room, user : User) {

		if (!room || !user)
			return new NotFoundException();

		const member = await this.membershipService.findMemberRoom(userJoin.userId, userJoin.roomId)		
		if (member)
			return new ConflictException('The user it\'s already in the room');

		switch (room.roomType) {
			case DIRECT:
				return new UnauthorizedException('Joining a direct it\'s not allowed');

			case GROUP:
				const gRoom: GroupRoom = await this.roomService.findGroup(userJoin.roomId);
				if (gRoom.isPrivate ||
						(gRoom.protected &&
							!userJoin.password &&
							!bcrypt.compareSync(userJoin.password, gRoom.password)
				))
					return new UnauthorizedException('The room is private or the wrong password is given');
				break;

			default:
				return new BadRequestException('Invalid room type');
		}
	}

	private async checkRoomCreationCondition(roomCreationData: RoomCreationData) {

		if (!(await this.roomService.checkUser(roomCreationData.userId)))
			return new NotFoundException("Users not found");
		
		if (!roomCreationData.userId.length)
			return new BadRequestException("The user list must have at least 1 user");

		let uniqueId = Array.from(new Set(roomCreationData.userId));

		if (!uniqueId.find((id) => id === roomCreationData.ownerId))
			return new BadRequestException("The owner must be a member");

		if (uniqueId.length !== roomCreationData.userId.length)
			return new ConflictException("A user cannot enter in the same room multiple times");

		switch (roomCreationData.roomType) {
			case DIRECT:
				return this.validateDirectRoom(roomCreationData);

			case GROUP:
				return this.validadeGroupRoom(roomCreationData);

			default:
				return new BadRequestException("Invalid room type!");
		}
	}

	async validateDirectRoom (roomCreationData: RoomCreationData) {
		if (roomCreationData.userId.length != 2)
			return new BadRequestException("Direct messaging should have only 2 participants")

		if (await this.membershipService.checkDirectRoomMembership(
					<User> {userId: roomCreationData.userId[0]},
					<User> {userId: roomCreationData.userId[1]}
				))
			return new ConflictException("This room already exists");
	}

	async validadeGroupRoom (roomCreationData: RoomCreationData) {
			if (!roomCreationData.roomName)
				return new BadRequestException("If the room it's a group a name is required");
	}
}
