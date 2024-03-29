
import { MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { BlackList } from 'src/entity/blacklist.entity';
import { GLOBAL_BLOCK, LOCAL_BLOCK } from 'src/constants/blackListType.constant';

@Injectable()
export class BlacklistService {

	constructor (
		@InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>
	) {}

	async checkExistence(
		blockerId: string,
		blockedId: string,
		roomId: string,
		blockType: number) {

		return this.blackListRepository.findOne({where: {
			blockerId: blockerId,
			blockedId: blockedId,
			roomId: roomId,
			blockType: blockType
		}});
	}

	async createBlackListEntry(
		blocker: User,
		blocked_user: User,
		room: Room,
		blockType: number,
		time: number
	) {

		if (blocker.userId === blocked_user.userId)
			return null;

		let blackListEntry = this.blackListRepository.create({
			blockerId: blocker.userId,
			blockedId: blocked_user.userId,
			blocker: blocker,
		 	blocked_user: blocked_user,
			blockType: blockType,
			room: room,
			block_end: new Date(Date.now() + time)
		});

		await this.blackListRepository.insert(blackListEntry);
		return blackListEntry;
	}

	async createInBulk(
		blocker: User,
		blocked_users: User[],
		room: Room,
		blockType: number,
		time: number
	) {

		blocked_users.forEach(async (blocked: User) => {
			await this.createBlackListEntry(blocker,
																				blocked,
																				room,
																				blockType,
																				time
			);
		});
	}
	
	async getBlockedByTheUser (user: User, room: Room) {
		const query = this.blackListRepository
			.createQueryBuilder('block')
			.where('block.status = true AND block.block_end > :timeNow', {timeNow: new Date()})
			.andWhere('(block.blocker = :id)', {id: user.userId})
			.andWhere('((block.block_type = :type AND block.room_id = :rid) OR block.block_type = :gtype)',
				{type: LOCAL_BLOCK, rid: room.roomId, gtype: GLOBAL_BLOCK})
		;
		return query.getMany();
		
	}

	// Get the list of the blocked user by the user
	async getBlockedUser(user: User, room: Room) {

		const query = this.blackListRepository
			.createQueryBuilder('block')
			.where('block.status = true AND block.block_end > :timeNow', {timeNow: new Date()})
			.andWhere('(block.blocker = :id OR block.blocked_user = :id)', {id: user.userId})
			.andWhere('((block.block_type = :type AND block.room_id = :rid) OR block.block_type = :gtype)',
				{type: LOCAL_BLOCK, rid: room.roomId, gtype: GLOBAL_BLOCK})
		;
		return query.getMany();
	}
	
	async unblockById(blackListId: string) {
		await this.blackListRepository.update({
							blackListId: blackListId },
								{ status: false });
	}

	async updateDuration(blackListId: string, duration: number) {

		if (!duration || duration < 0)
			duration = 300000;
		this.blackListRepository.update(
			{blackListId: blackListId},
			{block_end: new Date(Date.now() + duration),
				status: true});
	}

	async updateDurationInBulk(blackListIds: BlackList[], duration: number) {
		blackListIds.forEach(async (instance: BlackList) => {
			this.updateDuration(instance.blackListId, duration);
		});
	}

	async getAll() {
		return this.blackListRepository.find();
	}

	async getValid() {

		return this.blackListRepository
			.createQueryBuilder('block')
			.where('block.status = true')
			.andWhere('block.block_end > :timeNow', {timeNow: new Date()})
			.getMany();
	}
}
