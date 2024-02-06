import { IsNotEmpty,
		IsString,
		IsAlphanumeric,
		Length,
		MinLength,
		IsEmail,
		IsOptional,
		IsUrl } from "class-validator";

export class CreateUserDto {
	@IsString()
	@Length(3, 20)
	@IsNotEmpty()
	@IsAlphanumeric()
	userName: string;

	@IsNotEmpty()
	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(8, 32)
	password: string;

	@IsString()
	@IsNotEmpty()
	@Length(8, 32)
	passwordConfirm: string;
}
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
	profilePicture: string;
}
