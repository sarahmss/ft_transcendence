import { IsNotEmpty, IsPositive, Max, Min } from "class-validator";

export class RoomCreationData {

	@IsNotEmpty()
	@IsPositive()
	@Min(1)
	@Max(2)
	roomType: number;
	

	@IsNotEmpty()
	userId: string[];

	@IsNotEmpty()
	ownerId: string;

	roomName?: string;
	isPrivate?: boolean;
	password?: string;
}

export class RoomJoinData {
	@IsNotEmpty()
	roomId: string;

	@IsNotEmpty()
	userId: string;

	password?: string;
}
