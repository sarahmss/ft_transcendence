
import { IsNotEmpty } from 'class-validator';
import { Message } from 'src/entity/message.entity';
import { Room } from 'src/entity/room.entity';
import { User } from 'src/entity/user.entity';


export class createMessage {
	@IsNotEmpty()
	user: User;

	@IsNotEmpty()
	room: Room;

	@IsNotEmpty()
	message: string;
}


export class GetMessage {

	@IsNotEmpty()
	user: User;

	@IsNotEmpty()
	room: Room;

	quant: number;
}

export class UpdateMessage {

	@IsNotEmpty()
	message: Message;

	@IsNotEmpty()
	newMessage: string;
}

export class DeleteMessage {
	@IsNotEmpty()
	message: Message;
}
