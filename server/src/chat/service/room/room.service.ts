import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { DIRECT, GROUP } from 'src/constants/roomType.constant';
import { Membership } from 'src/entity/membership.entity';
import { DirectRoom, GroupRoom, Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {

	constructor (
		@InjectRepository(Room) private readonly roomRepository: Repository<Room>,
		@InjectRepository(GroupRoom) private readonly groupRepository: Repository<GroupRoom>,
		@InjectRepository(DirectRoom) private readonly directRepository: Repository<DirectRoom>,
	) {}

	async createGroupRoom(room: Room, isPrivate: boolean) {

		let groupRoom = this.groupRepository.create({isPrivate: isPrivate})
		groupRoom.roomId = room;

		this.groupRepository.insert(groupRoom);
	}

	async createDirectRoom(room: Room) {

		let directRoom = this.directRepository.create();
		directRoom.roomId = room;

		this.directRepository.insert(directRoom);
	}

	async createRoom(roomCreationData: RoomCreationData) {
		let room = this.roomRepository.create({roomType: roomCreationData.roomType,
												roomName: roomCreationData.roomName});

		this.roomRepository.insert(room);
		if (room.roomType == GROUP)
			this.createGroupRoom(room, roomCreationData.isPrivate);
		else if (room.roomType == DIRECT)
			this.createDirectRoom(room);

		return room;
	}

	async findRoom(roomId: string): Promise<Room> {
		return this.roomRepository.findOne({where: {roomId: roomId}});
	}

	async getRoomByType(roomType: number): Promise<Room[]>{
		return this.roomRepository.find({where: {roomType: roomType}});
	}

	async getListRoomByMember(member: Membership) {
		return this.roomRepository.find({where: {member: member}});
	}
}
