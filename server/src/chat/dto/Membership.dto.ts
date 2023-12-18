import { IsNotEmpty } from "class-validator";

export class MembershipDto {

	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	roomId: string;
}
