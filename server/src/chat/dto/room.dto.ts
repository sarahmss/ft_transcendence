import { IsNotEmpty } from "class-validator";
import { User } from "src/entity/user.entity";

export class RoomCreationData {

	@IsNotEmpty()
	roomType: number;

	@IsNotEmpty()
	isPrivate: boolean;

	@IsNotEmpty()
	user: User[];

	@IsNotEmpty()
	owner: User;

	roomName: string;

}
