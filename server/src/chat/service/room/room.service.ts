import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipDto } from 'src/chat/dto/Membership.dto';
import { RoomCreationData } from 'src/chat/dto/room.dto';
import { DIRECT, GROUP } from 'src/constants/roomType.constant';
import { Membership } from 'src/entity/membership.entity';
import { DirectRoom, GroupRoom, Room } from 'src/entity/room.entity';
import { Repository } from 'typeorm';
import { MembershipService } from '../membership/membership.service';

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

		await this.groupRepository.insert(groupRoom);
	}

	async createDirectRoom(room: Room) {

		let directRoom = this.directRepository.create();
		directRoom.roomId = room;

		await this.directRepository.insert(directRoom);
	}

	async createRoom(roomCreationData: RoomCreationData) {
		let room = this.roomRepository.create({roomType: roomCreationData.roomType,
												roomName: roomCreationData.roomName});

		await this.roomRepository.insert(room);

		if (room.roomType == GROUP)
			this.createGroupRoom(room, roomCreationData.isPrivate);
		else if (room.roomType == DIRECT)
			this.createDirectRoom(room);
		return room;
	}

	async getAll() {
		return this.roomRepository.find();
	}

	async findRoom(roomId: string): Promise<Room> {
		return this.roomRepository.findOne({where: {roomId: roomId}});
	}

	async getRoomByType(roomType: number): Promise<Room[]>{
		return this.roomRepository.find({where: {roomType: roomType}});
	}
}
