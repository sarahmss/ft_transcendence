
import { BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
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
import { Membership } from 'src/entity/membership.entity';


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

	@Get('curr/:rid/:id')
	async getCurrentMember(@Param('id') userId: string, @Param('rid') roomId: string) {
		
		const member = await this.membershipService.findMemberRoom(userId, roomId);

		if (!member)
			throw new NotFoundException("Member not found");

		const data = {
			admin: member.admin,
			owner: member.owner
		}
		return data;
		
	}

	@Get('s/:rid')
	async getRoomMember(@Param('rid') roomId: string) {
		const room = await this.roomService.findRoom(roomId);
		const groom = await this.roomService.findGroup(roomId);

		return ({
			...room,
			isPrivate: groom.isPrivate,
			isProtected: groom.protected
		});
	}

	@Post('list_room')
	async getListRoom(@Body('userId') userId: string) {


		if (!userId)
			throw new BadRequestException("User id not given");
		
		let membershipList = await this.membershipService.findMemberRoomsWithJoinRoom(userId);
		let roomList = [];

		const user = await this.userService.findById(userId);
		if (!user)
			throw new NotFoundException('user not found');

		for (let k = 0; k < membershipList.length; k++) {
			let room: any = membershipList[k].room;

			if (room.roomType === DIRECT) {
				const userList = await this.membershipService.findParticipantsWithUserLeftJoin(room.roomId, userId);

				if (!userList || userList.length === 0) {
					room.roomName = user.userName;
				}

				else {
					const otherUser = userList[0];
					room.roomName = otherUser.user.userName;
				}
			}

			else if (room.roomType === GROUP) {
				const groupRoom = (await this.roomService.findGroup(room.roomId));
				room.isProtected = groupRoom.protected;
				room.isPrivate = groupRoom.isPrivate;
			}
			roomList.push(room);
		}
		return roomList;
	}

	@Get("queryUser")
	async findUserByQueryString(@Query('q') query: string) {

		const userListRaw: any[] = await this.roomService.getUserByQuey(query);

		const formattedRes = userListRaw.map((user: User) => {
			return {
				userName: user.userName,
				userId: user.userId
			}
		});

		return formattedRes;
		
	}

	@Get("query")
	async findRoomByQueryString(@Query('q') query: string) {
		const roomRaw: any[] = await this.roomService.getRoomByQuery(query);

		const formattedRes = roomRaw.map((raw: GroupRoom) => {
			return (
				{
					roomId: raw.roomId,
					roomName: raw.room.roomName,
					protected: raw.protected
				}
			);
		});

		return formattedRes;
	}
	

	@Delete(':rid/:uid')
	async deleteRoom(@Param('rid') roomId: string, @Param('uid') userId: string) {
		if (!roomId || !userId)
			throw new BadRequestException("Required information not given");

		let room = await this.roomService.findRoom(roomId);
		if (!room)
			throw new NotFoundException("Room not found");

		let exception = await this.permissionCheck(userId, roomId);
		if (exception)
			throw exception;

		const members = await this.membershipService.findParticipantsNotExclusive(roomId); 
		await this.roomService.deleteRoom(room);

		this.eventEmitter.emit('room.delete',
			members,
			room,
			"chat-deleted",
			(__: any, _:any) => {return {
				roomId: roomId
			}});
	}

	@Post('kick')
	async kickRoom(
		@Body('roomId') roomId: string,
		@Body('requestorId') requestorId: string,
		@Body('userId') userId: string,
	) {
		if (!roomId || !userId)
			throw new BadRequestException("Required information not given");

		let user = await this.userService.findById(userId);
		let room = await this.roomService.findRoom(roomId);
		if (!room || !user)
			throw new NotFoundException("Room or User not found");


		const req = await this.membershipService.findMemberRoom(requestorId, roomId);
		if (!req)
			throw new NotFoundException("Requestor not found");


		const member = await this.membershipService.findMemberRoom(userId, roomId);
		if (!member)
			throw new NotFoundException("The user was not found in this room");

		if ((!req.admin && !req.owner) || member.owner)
			throw new UnauthorizedException("Not allowed to kick");

		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);

		await this.membershipService.leaveRoom(userId, roomId);

		this.eventEmitter.emit('room.leave',
			memberList,
			room,
			"left",
			(_: any, room : Room, user_leave: User = user) => {
				return {
					userId: user_leave.userId,
					roomId: room.roomId
				}
			}
		);
	}
	
	@Post('leave')
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
		if (!member)
			throw new NotFoundException("The user was not found in this room");

		const adminCount = await this.membershipService.countPrivileged(roomId);
		if (member.admin && adminCount <= 1)
			throw new UnauthorizedException("There must be at least one admin");

		await this.membershipService.leaveRoom(userId, roomId);
		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);

		this.eventEmitter.emit('room.leave',
			[...memberList,
				{userId: userId}
			],
			room,
			"left",
			(_: any, room : Room, user_leave: User = user) => {
				return {
					userId: user_leave.userId,
					roomId: room.roomId
				}
			}
		);
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

			let roomWithPass = false;
			if (roomCreationData.roomType === GROUP && roomCreationData.password)
				roomWithPass = true;

			const privStatus = roomCreationData.isPrivate ? true : false;

			if (roomCreationData.roomType === DIRECT) {
				const getAnotherUser = userList.filter((user) => user.userName !== roomCreationData.ownerId);

				room.roomName = getAnotherUser[0].userName;
			}

			this.eventEmitter.emit('room.create',
				roomCreationData.userId,
				room,
				"created",
				(_: string, room: Room, roomProtect: boolean = roomWithPass, roomPrivate: boolean = privStatus) => {
					return ({
						...room,
						isProtected: roomProtect,
						isPrivate: roomPrivate
					})
				}
			);
			return room;
		}
		catch ( error ) {
			throw error;
		}
	}

	@Post('join')
	async joinRoom(@Body() userJoin: RoomJoinData) {
		const room: Room = await this.roomService.findRoom(userJoin.roomId);
		const user: User = await this.userService.findById(userJoin.userId);

		let exception = await this.checkRoomJoinCondition(userJoin, room, user);

		if (exception)
			throw exception;

		try {
			await this.membershipService.joinSingleUser(user, room, false);
			const memberList = await this.membershipService.findParticipantsNotExclusive(room.roomId);
			this.eventEmitter.emit('room.join',
				memberList,
				room,
				"joined",
				(_: any,room: Room, member: User = user) => {
					return {
						userName: member.userName,
						userId: member.userId,
						profileImage: member.profilePicture,
						roomId: room.roomId,
					};
				}
			);
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

		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);

		this.eventEmitter.emit(
			'room.pass',
			memberList,
			"",
			"password-update",
			(_: any, __: any, rid: string = roomId ) => {
				return (
					{
						roomId: rid,
						isProtected: true,
					}
				)
			}
		);
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
		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);

		this.eventEmitter.emit(
			'room.pass',
			memberList,
			"",
			"password-update",
			(_: any, __: any, rid: string = roomId ) => {
				return (
					{
						roomId: rid,
						isProtected: false,
					}
				)
			}
		);
		return "password removed";
	}

	@Get(':roomId')
	async getParticipants(@Param('roomId') roomId: string) {
		const getMember: Membership[] = await this.membershipService.findParticipantsNotExclusiveLeftJoin(roomId);

		if (!getMember || !getMember.length)
			throw new NotFoundException("Members not found!");

		const formattedMember = getMember.map((member: Membership) => {
			return {
				admin: member.admin,
				owner: member.owner,
				userId: member.userId,
				userName: member.user.userName,
				profileImage: member.user.profilePicture,
			}
		});

		return formattedMember;
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

		const requestor = await this.membershipService.findMemberRoom(requestorId, roomId);
		if (!requestor.admin && !requestor.owner)
			throw new UnauthorizedException("Not enough privileges");

		const status = await this.roomService.togglePrivate(roomId);

		const memberList = await this.membershipService.findParticipantsNotExclusive(roomId);

		this.eventEmitter.emit('room.private',
			memberList,
			"",
			"private-toggle",
			(_: any, __ : Room, rid: string = roomId, isPrivate: boolean = status) => {
				return {
					roomId: rid,
					isPrivate: isPrivate
				}
			}
		);
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
