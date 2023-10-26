import { IsNotEmpty,
		MinLength,
		MaxLength,
		IsEmail,
		Matches,
		IsEmpty,
		IsOptional,
		IsUrl,
		IsAlphanumeric } from "class-validator";
import { Identical } from "./identical.decorators";
import { ApiProperty } from "@nestjs/swagger";
import { MessagesHelper } from "src/helpers/messages.helpers";
import { RegExHelper } from "src/helpers/regex.helper";
export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(15)
    @IsAlphanumeric()
    @ApiProperty({description: "not empty"})
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({description: "not empty"})
    email: string;

    @IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	@Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID})
	@ApiProperty({description: "not empty with : uppercase, lowercase, number and special character"})
	password: string;

    @IsNotEmpty()
    @Identical("password", {message: MessagesHelper.PASSWORD_CONFIRM})
    @ApiProperty({description: "not empty"})
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
	@IsUrl({ require_tld: false })
	profilePicture: string;
  }
