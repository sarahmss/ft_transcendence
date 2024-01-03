import { Message } from "src/entity/message.entity";
import { Room } from "src/entity/room.entity";
import { User } from "src/entity/user.entity";
import { IsNotEmpty } from "class-validator";

export class ChatData {

	@IsNotEmpty()
	room: Room;

	@IsNotEmpty()
	user: User;

	@IsNotEmpty()
	message: Message;
}
