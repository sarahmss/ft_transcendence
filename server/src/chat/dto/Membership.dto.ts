import { IsNotEmpty, Max, Min } from "class-validator";
import { JOIN, LEAVE } from "src/constants/roomType.constant";

export class MembershipDto {

	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	roomId: string;

	@IsNotEmpty()
	@Min(JOIN)
	@Max(LEAVE)
	action: number;
}
