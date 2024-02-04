import { Body,
	Controller,
	Delete,
	Get,
	HttpException,
	NotFoundException,
	Patch, 
  Post,
  UnauthorizedException} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { DeleteMessage,
	GetMessage,
	UpdateMessage,
	createMessage } from 'src/chat/dto/Message.dto';
import { BanService } from 'src/chat/service/ban/ban.service';

import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';
import { HideMessageService } from 'src/chat/service/hide-message/hide-message.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { Ban } from 'src/entity/ban.entity';
import { BlackList } from 'src/entity/blacklist.entity';
import { HideMessage } from 'src/entity/hideMessage.entity';
import { Membership } from 'src/entity/membership.entity';
import { Message } from 'src/entity/message.entity';
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
		private readonly banService: BanService,
		private readonly emitter: EventEmitter2) {}

	// Test endpoint
	@Get('all')
	async getAll() {
		const messageSelection = await this.messageService.getAllMessage();
		const sendMessages = messageSelection.map((msg: Message) => {
			return {
				message: msg.message,
				messageId: msg.messageId,
				messageTimestamp: msg.timestamp,
				authorId: msg.user.userId,
				author: msg.user.userName,
			}
		});
		return sendMessages;
	}

	// Test endpoint
	@Post('filter')
	async getFilter(
		@Body('roomId') roomId: string,
		@Body('userId') userId: string,
	) {
		const room = await this.roomService.findRoom(roomId);
		const user = await this.userService.findById(userId);
		let messageSelection: Message[];

		const messages = await this.messageService.findRoomMessage(room, 1000);
		const hideMessages = await this.hideMessageService.getHideEntriesByRoomAndUser(room,
																																										user);

		switch (hideMessages.length > 0) {
			case true:
				const filteredMessages = messages.filter(
					(message: Message) =>
						!hideMessages.some((hide: HideMessage) =>
							(message.messageId === hide.messageId))
				);

				messageSelection = filteredMessages;
				break;

			default:
				messageSelection = messages;
		}

		const sendMessages = messageSelection.map((msg: Message) => {
			return {
				message: msg.message,
				messageId: msg.messageId,
				messageTimestamp: msg.timestamp,
				authorId: msg.user.userId,
				author: msg.user.userName,
			}
		});

		console.log("number of messages VVV");
		console.log(sendMessages.length);

		return sendMessages;
	}

	@Post()
	async message(@Body('message') message: createMessage) {
		try {
			const user = await this.userService.findById(message.userId);
			const room = await this.roomService.findRoom(message.roomId);

			if (!user || !room)
				throw new NotFoundException();

			const banList = await this.banService.findBanRoomUser(room);
			const exception = this.banService.checkBanListIfUserBan(banList, user);
			if (exception)
				throw exception;

			const messageInstance = await this.messageService.createMessage(message.message,
																																room,
																																user);

			const blackList: BlackList[] = await this.blackListService
																									.getBlockedUser(user, room);

			const participantList: Membership[] = await this.membershipService
																												.findParticipants(message.roomId, user.userId);

			if (blackList.length > 0){
				const hideMessageClients =
					participantList.filter(
						(participant) =>
							blackList.some((blocked) =>  
								(participant.userId === blocked.blockedId ||
								(participant.userId === blocked.blockerId &&
								blocked.blockerId !== message.userId))) ||
							banList.some((banEntry: Ban) => (
								(banEntry.banId === participant.userId)
							))
					);

				this.hideMessageService
					.createHideEntryBulk(messageInstance,
																room,
																hideMessageClients);
			}

			this.emitter.emit('message.create',
													messageInstance,
													user.userName,
													blackList,
													participantList,
													banList
			);

		}
		catch (error) {
			throw error;
		}
	}

	@Post('get')
	async getMessage(@Body() roomAndUser: GetMessage) {
		const user = await this.userService.findById(roomAndUser.userId);
		const room = await this.roomService.findRoom(roomAndUser.roomId);

		if (!user || !room)
			throw new NotFoundException('User or Room not found');

		const messages = await this.messageService.findMessageWithPage(
			room,
			roomAndUser.page,
			roomAndUser.quant
		);

		let messageSelection: Message[];

		const hideMessages = await this.hideMessageService.getHideEntriesByRoomAndUser(room,
																																										user);

		switch (hideMessages.length > 0) {
			case true:
				const filteredMessages = messages.filter(
					(message: Message) =>
						!hideMessages.some((hide: HideMessage) =>
							(message.messageId === hide.messageId))
				);

				messageSelection = filteredMessages;
				break;

			default:
				messageSelection = messages;
		}

		const sendMessages = messageSelection.map((msg: Message) => {
			return {
				message: msg.message,
				messageId: msg.messageId,
				messageTimestamp: msg.timestamp,
				authorId: msg.user.userId,
				author: msg.user.userName,
			}
		});

		return sendMessages;
	}

	@Patch()
	async updateMessage(@Body() updateMessage: UpdateMessage) {

		let message = await this.messageService.findMessageById(updateMessage.messageId);
		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		const ban = await this.banService.findBanById(message.roomId, message.userId);
		if (ban)
			throw new UnauthorizedException("The user is banned for the time being");

		return this.messageService.updateMessage(message.messageId, 
												 updateMessage.newMessage);
	}

	@Delete()
	async deleteMessage(@Body() deleteMessage: DeleteMessage) {

		let message = await this.messageService.findMessageById(deleteMessage.messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		const ban = await this.banService.findBanById(message.roomId, message.userId);
		if (ban)
			throw new UnauthorizedException("The user is banned for the time being");

		this.messageService.deleteMessage(message.messageId);
		return "The message has been deleted";
	}
}
