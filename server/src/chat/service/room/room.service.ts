import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { DIRECT, GROUP } from 'src/constants/roomType.constant';
import { DirectRoom, GroupRoom, Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { MembershipService } from '../membership/membership.service';
import * as bcrypt from 'bcrypt';
import { MessageService } from '../message/message.service';
import { HideMessageService } from '../hide-message/hide-message.service';

@Injectable()
export class RoomService {

	constructor (
		@InjectRepository(Room) private readonly roomRepository: Repository<Room>,
		@InjectRepository(GroupRoom) private readonly groupRepository: Repository<GroupRoom>,
		@InjectRepository(DirectRoom) private readonly directRepository: Repository<DirectRoom>,
		@Inject(HideMessageService) private readonly hideMessageService: HideMessageService,
		@Inject(UsersService) private readonly userService: UsersService,
		@Inject(MembershipService) private readonly membershipService: MembershipService,
		@Inject(MessageService) private readonly messageService: MessageService,
	) {}

	async checkUser(userList: string[]): Promise<boolean> {
		for (let k = 0; k < userList.length; k++) {

			let userInstance = await this.userService.findById(userList[k]);

			if (!userInstance)
				return false;
		}
		return true;
	}

	async createGroupRoom(room: Room, isPrivate: boolean, password: string) {

		let groupRoom = this.groupRepository.create({
			roomId: room.roomId,
			room: room,
			isPrivate: isPrivate,
			password: password,
			protected: !!password
		});

		await this.groupRepository.insert(groupRoom);
	}

	async createDirectRoom(room: Room) {

		let directRoom = this.directRepository.create({
			roomId: room.roomId,
			room: room});

		await this.directRepository.insert(directRoom);
	}

	async createRoom(roomCreationData: RoomCreationData) {
		let room = this.roomRepository.create(
			{
				roomType: roomCreationData.roomType,
				roomName: roomCreationData.roomName
			});

		if (room.roomType == DIRECT)
			room.roomName = null;
		
		await this.roomRepository.insert(room);

		switch (room.roomType) {
			
			case GROUP:
			this.createGroupRoom(room,
														roomCreationData.isPrivate,
														roomCreationData.password);
				break;

			case DIRECT:
				this.createDirectRoom(room);
				break;
		}
		return room;
	}

	async getAll() {
		return this.roomRepository.find();
	}

	async findRoom(roomId: string): Promise<Room> {
		return this.roomRepository.findOne({where: {roomId: roomId}});
	}

	async findGroup(roomId: string): Promise<GroupRoom> {
		return this.groupRepository.findOne({where: {roomId: roomId}});
	}

	async findRoomWithArray(roomIds: string[]) {
		return this.roomRepository.find({where: {roomId: In(roomIds)}});
	}

	async getRoomByType(roomType: number): Promise<Room[]>{
		return this.roomRepository.find({where: {roomType: roomType}});
	}

	async deleteRoom(room: Room) {

		switch (room.roomType) {

			case GROUP:
				await this.groupRepository.delete(
					{roomId: room.roomId});
				break;

			case DIRECT:
				await this.directRepository.delete(
						{roomId: room.roomId});
				break;
		}

		await this.membershipService.deleteMembershipByRoom(
			room.roomId);

		await this.messageService.deleteAllRoomMessage(room.roomId);

		await this.roomRepository.delete({roomId: room.roomId});
	}

	async setPassRoom (password: string, roomId: string) {
		this.groupRepository.update(
			{roomId: roomId},
			{password: bcrypt.hashSync(password, 10),
				protected: true})
	}

	async unsetPassRoom (roomId: string) {
		this.groupRepository.update(
			{roomId: roomId},
			{password: null,
				protected: false}
		)
	}

	async togglePrivate(roomId: string) {
		const privateStatus = await this.groupRepository.findOne({
																						select: { isPrivate: true },
																						where: { roomId: roomId }
																					});

		const status = !privateStatus.isPrivate;
		this.groupRepository.update(
			{roomId: roomId},
			{isPrivate: status}
		)
		return status;
	}
}
