
import { IsNotEmpty } from 'class-validator';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';

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

	page: number;

	quant: number;
}

export class UpdateMessage {

	@IsNotEmpty()
	messageId: string;

	@IsNotEmpty()
	newMessage: string;
}

export class DeleteMessage {
	@IsNotEmpty()
	messageId: string;
}
