import { IsNotEmpty, IsPositive, Max, Min } from "class-validator";
import { Room } from "src/entity/room.entity";
import { User } from "src/entity/user.entity";

export class RoomCreationData {

	@IsNotEmpty()
	@IsPositive()
	@Min(1)
	@Max(2)
	roomType: number;
	
	@IsNotEmpty()
	isPrivate: boolean;

	@IsNotEmpty()
	user: User[];

	@IsNotEmpty()
	owner: User;

	roomName: string;

	password?: string;
}

export class RoomJoinData {
	@IsNotEmpty()
	room: Room;

	@IsNotEmpty()
	user: User;

	password?: string;
}
