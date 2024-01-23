import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HideMessage } from 'src/entity/hideMessage.entity';
import { Message } from 'src/entity/message.entity';
import { User } from 'src/entity/user.entity';
import { Room } from 'src/entity/room.entity';
import { Membership } from 'src/entity/membership.entity';

// This service will be used to filter out messages from the target user
@Injectable()
export class HideMessageService {

  constructor (
    @InjectRepository(HideMessage) private readonly hideMessageRepository: Repository<HideMessage>
  ) {}

  async createHideEntry(message: Message, room: Room, user: User) {
    const entry = this.hideMessageRepository.create({
      message: message,
      messageId: message.messageId,

      room: room,
      roomId: room.roomId,

      target: user,
      targetId: user.userId,

    });
    
    await this.hideMessageRepository.insert(entry);
  }

  async createHideEntryBulk (message: Message, room: Room, users: Membership[]) {
    users.forEach(async (user) => {
      const entry: HideMessage = this.hideMessageRepository.create({
        message: message,
        messageId: message.messageId,
        room: room,
        roomId: room.roomId,
        target: user.user,
        targetId: user.userId,
      });
      await this.hideMessageRepository.insert(entry);
    })
  }

  // Get the entry by roomId
  async getHideEntryByRoom (roomId: string) {
    return this.hideMessageRepository.find(
      { where: { room: { roomId: roomId } } });
  }
}
