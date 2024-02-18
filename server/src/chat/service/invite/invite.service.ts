import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite } from 'src/entity/invite.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class InviteService {

  constructor (
    @InjectRepository(Invite) private readonly inviteRepository: Repository<Invite>,
  ) {}

  async findValid(inviteId: string) {
    return this.inviteRepository.findOne({
      relations: ['room', 'user'],
      where: {
        inviteId: inviteId,
        timeLimit: MoreThan(new Date()),
        valid: true
      }
    });
  }

  async createInvitation(room: Room, user: User) {

    let instance = this.inviteRepository.create({
      user: user,
      userId: user.userId,
      room: room,
      roomId: room.roomId,
    });

    await this.inviteRepository.insert(instance);
    return instance;
  }

  async useInvitation(inviteId: string, response: boolean) {
    await this.inviteRepository.update(
      {inviteId: inviteId},
      {valid: response}
    );
  }

  async invalidate(userId: string, roomId: string) {
    return this.inviteRepository.update(
      {userId: userId, roomId: roomId, valid: true},
      {valid: false}
    );
    
  }

  async getInvitation(userId: string) {
    return this.inviteRepository.find(
      {relations: ['room'],
        where: {
        userId: userId,
        valid: true,
        timeLimit: MoreThan(new Date())
      }}
    );
  }
  
}
