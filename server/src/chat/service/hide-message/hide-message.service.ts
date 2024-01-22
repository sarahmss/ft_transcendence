import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HideMessage } from 'src/entity/hideMessage.entity';
import { Message } from 'src/entity/message.entity';
import { User } from 'src/entity/user.entity';
import { Room } from 'src/entity/room.entity';

@Injectable()
export class HideMessageService {

  constructor (
    @InjectRepository(HideMessage) private readonly hideMessageRepository: Repository<HideMessage>
  ) {}

  async createHideEntry(message: Message, room: Room, user: User) {
    const entry = this.hideMessageRepository.create({
      message: message,
      target: user
    });
    
    await this.hideMessageRepository.insert(entry);
  }

  // Get the entry by roomId
  async getHideEntryByRoom (roomId: string) {
    return this.hideMessageRepository.find(
      { where: { room: { roomId } } });
  }
}
