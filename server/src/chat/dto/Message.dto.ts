
import { IsNotEmpty } from 'class-validator';

export class createMessage {
	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	roomId: string;

	@IsNotEmpty()
	message: string;
}

export class GetMessage {

	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	roomId: string;

	@IsNotEmpty()
	page: number;

	quant: number;
}

export class UpdateMessage {

	@IsNotEmpty()
	messageId: string;

	@IsNotEmpty()
	newMessage: string;

	@IsNotEmpty()
	userId: string;
}

export class DeleteMessage {
	@IsNotEmpty()
	messageId: string;

	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	roomId: string;
}
