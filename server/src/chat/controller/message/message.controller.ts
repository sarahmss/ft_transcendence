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
import { MessageService } from 'src/chat/service/message/message.service';

@Controller('message')
export class MessageController {

	constructor (
		private readonly messageService: MessageService,
		private readonly emitter: EventEmitter2) {}

	@Post()
	async message(@Body() message: createMessage) {
		try {
			this.messageService.createMessage(message.message,
																					message.room,
																					message.user);
			this.emitter.emit('message.create', message);
		}
		catch {
			throw new InternalServerErrorException();
		}
	}

	@Get()
	async getMessage(@Body() roomAndUser: GetMessage) {
		return await this.messageService.findMessage(roomAndUser.user,
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
