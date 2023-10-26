import {
	MaxLength,
	MinLength,
	IsNotEmpty,
	IsNumberString,
} from 'class-validator';

	export class TwoFaAuthDto {
	@IsNotEmpty()
	@IsNumberString()
	@MinLength(6)
	@MaxLength(6)
	code: string;
}
