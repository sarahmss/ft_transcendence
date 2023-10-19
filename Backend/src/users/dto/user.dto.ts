import { IsNotEmpty, MinLength, MaxLength, IsEmail, Matches, IsEmpty, IsOptional, IsUrl, IsAlphanumeric } from "class-validator";
import { Identical } from "./identical.decorators";
import { ApiProperty } from "@nestjs/swagger";

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
	@Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: "password is too weak !! [insert: uppercase, lowercase, number and special character]",
	})
	@ApiProperty({description: "not empty with : uppercase, lowercase, number and special character"})
	password: string;

    @IsNotEmpty()
    @Identical("password", {
        message: "The passwords entered are not identical",
    })
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
