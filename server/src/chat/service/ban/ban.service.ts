import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ban } from 'src/entity/ban.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';

import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class BanService {

  constructor(
    @InjectRepository(Ban) private readonly banRepository: Repository<Ban>,
  ) {}

  async createBan(
    target: User,
    room: Room,
    duration: number
  ) {
    const ban = this.banRepository.create({
      banned: target,
      bannedId: target.userId,
      roomId: room.roomId,
      room: room,
      ban_end: new Date(Date.now() + duration),
    });

    await this.banRepository.insert(ban);
    return ban;
  }

  async unban(banEntry: Ban) {
    this.banRepository.delete(
      {banId: banEntry.banId});
    
  }

  async findBan(room: Room, bannedUser: User) {
    return this.banRepository.findOne(
      {where: {room: room,
        ban_end: MoreThan(new Date()),
        banned: bannedUser}}
    );
  }

  async findBanById(roomId: string, bannedId: string) {
    return this.banRepository.findOne(
      {where: {
        roomId: roomId,
        bannedId: bannedId
      }}
    );
  }

  async findBanRoomUser(room: Room) {
    return this.banRepository.find({
      where: { room: room }
    });
    
  }

	checkBanListIfUserBan(banList: Ban[], user: User) {
		if (banList.some((ban: Ban) => (user.userId === ban.bannedId)))
			return new UnauthorizedException("The current user is banned");
	}

}
