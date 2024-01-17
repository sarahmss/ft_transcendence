
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

	async createBlackListEntry(blocker: User, blocked_user: User, room: Room) {

		if (blocker.userId !== blocked_user.userId)
			return null;

		let blackListEntry = this.blackListRepository.create({
			blocker: blocker,
		 	blocked_user: blocked_user,
			roomId: room
		});

		await this.blackListRepository.insert(blackListEntry);
		return blackListEntry;
	}

	// Get the list of the blocked user by the user
	async getBlockedUser(blocker: User) {
		return await this.blackListRepository.find({
			where: { blocker: blocker }});
	}
	
	async unblockById(blackListId: string) {
		this.blackListRepository.update({
			blackListId: blackListId },
			{ status: false });

	}

	async blockById(blackListId: string) {
		this.blackListRepository.update({
			blackListId: blackListId },
			{ status: true });
	}
}
