import { Body,
	Controller,
	Delete,
	Get,
	HttpException,
	InternalServerErrorException,
	Patch, 
    Post} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteMessage, GetMessage, UpdateMessage, createMessage } from 'src/chat/dto/Message.dto';
import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { UsersService } from 'src/users/users.service';

@Controller('message')
export class MessageController {

	constructor (
		private readonly blackListService: BlacklistService,
		private readonly messageService: MessageService,
		private readonly userService: UsersService,
		private readonly emitter: EventEmitter2) {}

	@Get('all')
	async getAll() {
		return await this.messageService.getAllMessage();
	}

	@Post()
	async message(@Body() message: createMessage) {
		try {
			const messageInstance = await this.messageService.createMessage(message.message,
																																message.room,
																																message.user);

			const user = await this.userService.findById(message.user.userId);
			const blackList = await this.blackListService.getBlockedUser(message.user);

			this.emitter.emit('message.create',
													messageInstance,
													user.userName,
													blackList);
		}
		catch {
			throw new InternalServerErrorException();
		}
	}

	@Get()
	async getMessage(@Body() roomAndUser: GetMessage) {
		return await this.messageService.findRoomMessage(
																			roomAndUser.room,
																		  roomAndUser.quant);
	}

	@Patch()
	async updateMessage(@Body() updateMessage: UpdateMessage) {

		let message = await this.messageService.findMessageById(updateMessage.message.messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		return this.messageService.updateMessage(message.messageId, 
												 updateMessage.newMessage);
	}

	@Delete()
	async deleteMessage(@Body() deleteMessage: DeleteMessage) {

		let message = await this.messageService.findMessageById(deleteMessage.message.messageId);

		if (!message)
			throw new HttpException('Message doesn\'t exist!', 404);

		this.messageService.deleteMessage(message.messageId);
	}
}
