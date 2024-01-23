import { Body,
	Controller,
	Delete,
	Get,
	HttpException,
	NotFoundException,
	Patch, 
  Post} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { DeleteMessage,
	GetMessage,
	UpdateMessage,
	createMessage } from 'src/chat/dto/Message.dto';

import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';
import { HideMessageService } from 'src/chat/service/hide-message/hide-message.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { UsersService } from 'src/users/users.service';

@Controller('message')
export class MessageController {

	constructor (
		private readonly blackListService: BlacklistService,
		private readonly messageService: MessageService,
		private readonly membershipService: MembershipService,
		private readonly userService: UsersService,
		private readonly roomService: RoomService,
		private readonly hideMessageService: HideMessageService,
		private readonly emitter: EventEmitter2) {}

	@Get('all')
	async getAll() {
		return await this.messageService.getAllMessage();
	}

	@Post()
	async message(@Body() message: createMessage) {
		try {
			const user = await this.userService.findById(message.userId);
			const room = await this.roomService.findRoom(message.roomId);

			if (!user || !room)
				throw new NotFoundException();

			const messageInstance = await this.messageService.createMessage(message.message,
																																room,
																																user);

			const blackList = await this.blackListService.getBlockedUser(user);
			const participantList = await this.membershipService.findParticipants(message.roomId);

			const hideMessageClients = participantList.filter(
				(participant) =>
					blackList.some((blocked) =>  
						(participant.userId === blocked.blockedId ||
						(participant.userId === blocked.blockerId && blocked.blockerId !== message.userId))));

			this.hideMessageService
				.createHideEntryBulk(messageInstance,
															room,
															hideMessageClients);

			this.emitter.emit('message.create',
													messageInstance,
													user.userName,
													blackList);
		}
		catch (error) {
			throw error;
		}
	}

	@Get()
	async getMessage(@Body() roomAndUser: GetMessage) {
		const user = await this.userService.findById(roomAndUser.userId);
		const room = await this.roomService.findRoom(roomAndUser.roomId);

		if (!user || !room)
			throw new NotFoundException('User or Room not found');

		return await this.messageService.findRoomMessage(
																			room,
																		  roomAndUser.quant);
	}

	@Patch()
	async updateMessage(@Body() updateMessage: UpdateMessage) {

		let message = await this.messageService.findMessageById(updateMessage.messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		return this.messageService.updateMessage(message.messageId, 
												 updateMessage.newMessage);
	}

	@Delete()
	async deleteMessage(@Body() deleteMessage: DeleteMessage) {

		let message = await this.messageService.findMessageById(deleteMessage.messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		this.messageService.deleteMessage(message.messageId);
	}
}
