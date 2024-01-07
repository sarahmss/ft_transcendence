import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from 'src/entity/membership.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
	constructor (
		@InjectRepository(Membership) private readonly membershipRepository: Repository<Membership>
	) {}

	async joinRoom(user: User[],
				   room: Room,
				   owner: string
				  ) {

		for (let k = 0; k < user.length ; k++) {

			let owner_status: boolean = false;

			if (user[k].userId == owner)
				owner_status = true;


			let member = this.membershipRepository.create({userId: user[k].userId,
														roomId: room.roomId,
			room: room,
			user: user[k],
			owner: owner_status});

			await this.membershipRepository.insert(member);
		}
	}

	async giveAdmin(user: User, room: Room) {
		await this.membershipRepository.update({userId: user.userId, roomId: room.roomId}, { admin: true });
	}

	async removeAdmin(user: User, room: Room) {
		await this.membershipRepository.update({userId: user.userId, roomId: room.roomId}, { admin: false });
	}

	async leaveRoom(user: User, room: Room) {
		await this.membershipRepository.delete({userId: user.userId, roomId: room.roomId});
	}

	async findMemberRooms(userId: string) {
		return await this.membershipRepository.find({where: {userId: userId}});
	}

	async findMemberRoom(userId: string, roomId: string) {
		return await this.membershipRepository.find({where: {userId: userId,
													roomId: roomId}});
	}
}
