import { Message } from "src/entity/message.entity";
import { Room } from "src/entity/room.entity";
import { User } from "src/entity/user.entity";
import { IsNotEmpty } from "class-validator";

export class ChatData {

	@IsNotEmpty()
	room: string;

	@IsNotEmpty()
	user: string;

	@IsNotEmpty()
	message: Message;
}
