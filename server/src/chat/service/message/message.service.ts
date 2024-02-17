import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Room } from 'src/entity/room.entity';
import { isEmpty } from 'class-validator';
import * as xssFilters from 'xss-filters';

@Injectable()
export class MessageService {
	constructor (
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async createMessage(message: string,
						room: Room,
						user: User): Promise<Message> {

		const sanitizedMessage = xssFilters.inHTMLData(message);

		let messageInstance: Message = this.messageRepository.create({
				message: sanitizedMessage,
				room: room,
				user: user,
				roomId: room.roomId,
				userId: user.userId,
			});

		await this.messageRepository.insert(messageInstance);

		return messageInstance;
	}

	async findMessageById(messageId: string) {
		return this.messageRepository.findOne({where: {messageId: messageId}});
	}

	async findMessageByIdJoined(messageId: string) {
		return this.messageRepository.findOne(
			{
				relations: ['user', 'room'],
				where: {messageId: messageId}
			}
		);
		
	}

	async findRoomMessage(room: Room,
					 quant: number = 25): Promise<Message[]> {

		const query = this.messageRepository
			.createQueryBuilder('msg')
			.innerJoinAndSelect('msg.user', 'user')
			.where('msg.room_id = :rid', {rid: room.roomId})
			.take(quant)
			.orderBy('msg.timestamp', 'DESC');


		return query.getMany();
	}

	async findRoomMessageAll(room: Room): Promise<Message[]> {

		const query = this.messageRepository
			.createQueryBuilder('msg')
			.innerJoinAndSelect('msg.user', 'user')
			.where('msg.room_id = :rid', {rid: room.roomId})
			.orderBy('msg.timestamp', 'DESC');

		return query.getMany();
	}
	

	async findMessageWithPage(
							  room: Room,
							  page: number,
							  quant: number = 25): Promise<Message[]> {

		if (isEmpty(page) || page < 0)
			page = 0;

		const query = this.messageRepository
			.createQueryBuilder('msg')
			.innerJoinAndSelect('msg.user', 'user')
			.where('msg.room_id = :rid', {rid: room.roomId})
			.take(quant)
			.skip(quant * page)
			.orderBy('msg.timestamp', 'DESC');

		return query.getMany();
	}

	async updateMessage(messageId: string,
					   newMessage: string) {

		const sanitizedMessage = xssFilters.inHTMLData(newMessage);

		return this.messageRepository.update(
																	{messageId: messageId},
																	{message: sanitizedMessage}
						);
	}

	async deleteMessage(messageId: string) {
		await this.messageRepository.delete({messageId: messageId});
	}

	async getAllMessage() {

		const query = this.messageRepository
			.createQueryBuilder('msg')
			.innerJoinAndSelect('msg.user', 'user')
			.orderBy('msg.timestamp', 'DESC');

		return query.getMany();

	}

	async deleteAllRoomMessage(roomId: string) {
		await this.messageRepository.delete({roomId: roomId});
	}
}
