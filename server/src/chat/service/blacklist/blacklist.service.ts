import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackList } from 'src/entity/blacklist.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistService {

	constructor (
		@InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>
	) {}

	async createBlackList(blocker: User, blocked_user: User, room: Room) {
		let blackListEntry = this.blackListRepository.create({ blocker: blocker,
															 	blocked_user: blocked_user,
																roomId: room})

		this.blackListRepository.insert(blackListEntry);
		return blackListEntry;
	}

	async unblockById(blackListId: string) {
		this.blackListRepository.update({ blackListId: blackListId },
										{ status: false })

	}

	async blockById(blackListId: string) {
		this.blackListRepository.update({ blackListId: blackListId },
										{ status: true })

	}
}
