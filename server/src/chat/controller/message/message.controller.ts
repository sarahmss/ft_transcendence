import { Body,
	Controller,
	Delete,
	Get,
	HttpException,
	NotFoundException,
	Param,
	Patch, 
  Post,
  UnauthorizedException} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import {
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
		private readonly eventEmitter: EventEmitter2) {}

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


	@Post()
	async message(@Body('message') message: createMessage) {
		try {
			const user = await this.userService.findById(message.userId);
			const room = await this.roomService.findRoom(message.roomId);

			if (!user || !room)
				throw new NotFoundException();

			const memberException = await this.checkIfUserIsMember(message.userId, message.roomId)
			if (memberException)
				throw memberException;

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
																												.findParticipantsNotExclusive(message.roomId);

			if (blackList.length > 0 || banList.length > 0){
				const hideMessageClients =
					participantList.filter(
						(participant) =>
							blackList.some((blocked) =>  
								(participant.userId === blocked.blockedId ||
								participant.userId === blocked.blockerId) &&
								participant.userId !== message.userId) ||
							banList.some((banEntry: Ban) => (
								(banEntry.banId === participant.userId)
							))
					);


				this.hideMessageService
					.createHideEntryBulk(messageInstance,
																room,
																hideMessageClients);

			}

			const messageResp = {
				message: messageInstance.message,
				messageId: messageInstance.messageId,
				messsageTimestamp: messageInstance.timestamp,
				authorId: messageInstance.userId,
				author: user.userName,
			}

			this.broadcastToUsersWithFilter(
				messageResp,
				blackList,
				participantList,
				banList,
				"message-response",
				"message.create"
			);

			return messageResp;
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
		const exception = await this.checkIfUserIsMember(roomAndUser.userId, roomAndUser.roomId)
		if (exception)
			throw exception;

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


		let message = await this.messageService.findMessageByIdJoined(updateMessage.messageId);
		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		const exception = await this.checkIfUserIsMember(updateMessage.userId, message.roomId);
		if (exception)
			return exception;

		if (message.userId !== updateMessage.userId)
			throw new UnauthorizedException('The message doesn\'t belong to him');

		const ban = await this.banService.findBanById(message.roomId, message.userId);
		if (ban)
			throw new UnauthorizedException("The user is banned for the time being");

		await this.messageService.updateMessage(message.messageId, 
																						 updateMessage.newMessage);
		
		const messageResp = {
			message: updateMessage.newMessage,
			messageId: message.messageId,
		}

		const participantList = await this.membershipService.findParticipantsNotExclusive(message.roomId);

		this.broadcastToUsers(
			messageResp,
			participantList,
			"message-update",
			"broadcast.update"
		);


		return  messageResp;
	}

	@Delete(':msgId')
	async deleteMessage(
		@Param('msgId') messageId: string,
		@Param('userId') userId: string,
	) {

		let message = await this.messageService.findMessageById(messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		const exception = await this.checkIfUserIsMember(userId, message.roomId);
		if (exception)
			throw exception;

		const ban = await this.banService.findBanById(message.roomId, message.userId);
		if (ban)
			throw new UnauthorizedException("The user is banned for the time being");

		await this.messageService.deleteMessage(message.messageId);

		const particiapantList = await this.membershipService.findParticipantsNotExclusive(message.roomId);

		const messageResp = {
			messageId: message.messageId,
		}
		
		this.broadcastToUsers(
			messageResp,
			particiapantList,
			"delete-message",
			"broadcast.delete"
		);

		return  messageResp;
	}

	async checkIfUserIsMember(userId: string, roomId: string) {
		if (!(await this.membershipService.checkIfUserIsMember(roomId, userId)))
			return new UnauthorizedException('This user it\'s not a member');
		return false;
	}

	private broadcastToUsersWithFilter (
		messageResp: any,
		blackList: any[],
		participantList: any[],
		banList: any[],
		event: string = "message-response",
		emission_event: string
	) {

		this.eventEmitter.emit(emission_event,
			messageResp,
			blackList,
			participantList,
			banList,
			event
		);
		
	}

	private broadcastToUsers ( 
		messageResp: any,
		participantList: any[],
		event: string,
		emission_event: string
		) {

		this.eventEmitter.emit(
			emission_event,
			messageResp,
			participantList,
			event
		);

	}
}
