import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Room } from 'src/entity/room.entity';

@Injectable()
export class MessageService {
	constructor (
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async createMessage(message: string,
						room: Room,
						user: User): Promise<Message> {

		let messageInstance = this.messageRepository.create()

		messageInstance.message = message;
		messageInstance.roomId = room;
		messageInstance.userId = user;

		this.messageRepository.insert(messageInstance);
		return messageInstance;
	}

	async findMessageById(messageId: string) {
		return this.messageRepository.findOne({where: {messageId: messageId}});
	}

	async findMessage(user: User,
					 room: Room,
					 quant: number = 25): Promise<Message[]> {

		return this.messageRepository.find({ where:
										   		 {userId: user, roomId: room},
											 order:
												 { timestamp: 'DESC' },
											 take: quant});
	}

	async findMessageWithPage(user: User,
							  room: Room,
							  page: number,
							  quant: number = 25): Promise<Message[]> {

		if (page < 0)
			page = 0;

		return this.messageRepository.find({ where:
										   		 {userId: user, roomId: room},
											 order:
												 { timestamp: 'DESC' },
											 take: quant,
											 skip: page * quant});
	}

	async updateMessage(messageId: string,
					   newMessage: string) {
		return this.messageRepository.update({messageId: messageId},
											 {message: newMessage});
	}

	async deleteMessage(messageId: string) {
		this.messageRepository.delete({messageId: messageId});
	}
}
