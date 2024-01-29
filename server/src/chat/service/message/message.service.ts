import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Room } from 'src/entity/room.entity';
import { isEmpty } from 'class-validator';

@Injectable()
export class MessageService {
	constructor (
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async createMessage(message: string,
						room: Room,
						user: User): Promise<Message> {

		let messageInstance: Message = this.messageRepository.create({
				message: message,
				room: room,
				user: user,
				roomId: room.roomId,
				userId: user.userId,
			});

		let inserted = await this.messageRepository.insert(messageInstance);

		return messageInstance;
	}

	async findMessageById(messageId: string) {
		return await this.messageRepository.findOne({where: {messageId: messageId}});
	}

	async findRoomMessage(room: Room,
					 quant: number = 25): Promise<Message[]> {

		return this.messageRepository.find({ where:
													{ room: room },
													order:
														{ timestamp: 'DESC' },
													take: quant});
	}

	async findMessageWithPage(
							  room: Room,
							  page: number,
							  quant: number = 25): Promise<Message[]> {

		if (isEmpty(page) || page < 0)
			page = 0;

		return this.messageRepository.find({ where:
										   		 {user: user, room: room},
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
		await this.messageRepository.delete({messageId: messageId});
	}

	async getAllMessage() {
		return this.messageRepository
			.find();
	}

	async deleteAllRoomMessage(roomId: string) {
		await this.messageRepository.delete({roomId: roomId});
	}
}
