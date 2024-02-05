import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DIRECT } from 'src/constants/roomType.constant';
import { Membership } from 'src/entity/membership.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { Equal, Not, Repository } from 'typeorm';

@Injectable()
export class MembershipService {
	constructor (
		@InjectRepository(Membership) private readonly membershipRepository: Repository<Membership>
	) {}

	async joinRoom(user: User[],
				   room: Room,
				   owner: string) {
		for (let k = 0; k < user.length ; k++) {

			let owner_status: boolean = false;

			if (user[k].userId == owner)
				owner_status = true;

			await this.joinSingleUser(user[k], room, owner_status);
		}
	}

	async joinSingleUser (user: User, room: Room, owner_status: boolean) {
		let member = this.membershipRepository.create({
			user: user,
			userId: user.userId,
			room: room,
			roomId: room.roomId,
			owner: owner_status
		});
		await this.membershipRepository.insert(member);
	}

	async getAll() {
		return this.membershipRepository.find();
	}

	async giveAdmin(user: User, room: Room) {
		await this.membershipRepository.update(
			{userId: user.userId, roomId: room.roomId},
			{ admin: true });
	}

	async removeAdmin(user: User, room: Room) {
		await this.membershipRepository.update(
			{userId: user.userId, roomId: room.roomId},
			{ admin: false });
	}

	async leaveRoom(userId: string, roomId: string) {
		return this.membershipRepository.delete({userId: userId, roomId: roomId});
	}

	async findMemberRooms(userId: string) {
		return this.membershipRepository.find({where: {userId: userId}});
	}

	async findMemberRoom(userId: string, roomId: string) {
		return this.membershipRepository.findOne({where: {userId: userId,
													roomId: roomId}});
	}

	async findParticipants(roomId: string, userId: string) {
		return this.membershipRepository.find({where:
			{ roomId: roomId, userId: Not(Equal(userId)) }
		});
	}


	async checkDirectRoomMembership(user1: User, user2: User): Promise<boolean> {
		let result = await this.membershipRepository
								.createQueryBuilder('membership')
								.leftJoinAndSelect('membership.room', 'room')
								.where('membership.userId = :userId1',
												{userId1: user1.userId})
						    .andWhere('membership.room_Id IN (SELECT room_Id FROM membership WHERE user_Id = :userId2)',
												{ userId2: user2.userId })
						    .andWhere('room.roomType = :roomType', { roomType: DIRECT })
								.getOne();
		return !!result; // This trick is to cast the object to a boolean value :P
	}

	async deleteMembershipByRoom(roomId: string) {
		await this.membershipRepository.delete({roomId: roomId});
	}
}
