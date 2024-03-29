import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { DIRECT, GROUP } from 'src/constants/roomType.constant';
import { DirectRoom, GroupRoom, Room } from 'src/entity/room.entity';
import { UsersService } from 'src/users/users.service';
import { In, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';

@Injectable()
export class RoomService {

	constructor (
		@InjectRepository(Room) private readonly roomRepository: Repository<Room>,
		@InjectRepository(GroupRoom) private readonly groupRepository: Repository<GroupRoom>,
		@InjectRepository(DirectRoom) private readonly directRepository: Repository<DirectRoom>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@Inject(UsersService) private readonly userService: UsersService,
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
			password: bcrypt.hashSync(password, 10),
		});

		if (password)
			groupRoom.protected = true;

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

	async getRoomByQuery(
		query: string
	) {
		return this.groupRepository
			.createQueryBuilder('group')
			.innerJoinAndSelect('group.room', 'room')
			.where('room.roomName LIKE :pattern', {pattern: `%${query}%`})
			.andWhere('group.is_private = false')
			.getMany();
	}

	async  getUserByQuey(
		query: string
	) {
		return this.userRepository.find(
			{
				where: {
					userName: Like(`%${query}%`)
				}
			}
		);
	}
}
