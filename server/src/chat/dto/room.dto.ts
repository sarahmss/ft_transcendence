import { IsNotEmpty, IsPositive, Max, Min } from "class-validator";
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

}
