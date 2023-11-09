import { IsNotEmpty,
		MinLength,
		IsEmail,
		IsOptional,
		IsUrl } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsNotEmpty()
	@MinLength(3)
	userName: string;

	@IsNotEmpty()
	@IsEmail()
	@IsOptional()
	email: string;

	@IsOptional()
	@IsUrl({ require_tld: false })
	profilePicture: string;
}
