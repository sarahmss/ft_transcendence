
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { BlackList } from 'src/entity/blacklist.entity';

@Injectable()
export class BlacklistService {

	constructor (
		@InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>
	) {}

	async checkExistence(blockerId: string,
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

	async createBlackListEntry(blocker: User, blocked_user: User, room: Room, blockType: number) {

		if (blocker.userId === blocked_user.userId)
			return null;

		let blackListEntry = this.blackListRepository.create({
			blockerId: blocker.userId,
			blockedId: blocked_user.userId,
			blocker: blocker,
		 	blocked_user: blocked_user,
			blockType: blockType,
			room: room
		});

		await this.blackListRepository.insert(blackListEntry);
		return blackListEntry;
	}

	async createInBulk(blocker: User, blocked_users: User[], room: Room, blockType: number) {
		blocked_users.forEach(async (blocked: User) => {
			await this.createBlackListEntry(blocker,
																				blocked,
																				room,
																				blockType);
		});
	}

	// Get the list of the blocked user by the user
	async getBlockedUser(blocker: User) {
		return await this.blackListRepository.find({
			where: [{blocker: blocker, status: true },
							{blocked_user: blocker, status: true}],
		});
	}
	
	async unblockById(blackListId: string) {
		await this.blackListRepository.update({
							blackListId: blackListId },
								{ status: false });

	}

	async blockById(blackListId: string) {
		await this.blackListRepository.update({
						blackListId: blackListId },
							{ status: true });
	}

	async updateDuration(blackListId: string, duration: number) {

		if (duration || duration < 0)
			duration = 300000;
		this.blackListRepository.update({
			blackListId: blackListId},
			{block_end: Date.now() + duration});
	}

	async updateDurationInBulk(blackListIds: BlackList[], duration: number) {
		blackListIds.forEach(async (instance: BlackList) => {
			this.updateDuration(instance.blackListId, duration);
		});
	}

	async getAll() {
		return this.blackListRepository.find();
	}
}
