import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { MessagesHelper } from 'src/helpers/messages.helpers';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: any)//: Promise<LocalUserData>
	{
		const { userName } = payload;
		const user = await this.usersService.findByUserName(userName);
		if (!user) {
			throw new HttpException(MessagesHelper.USER_NOT_FOUND,
									HttpStatus.NOT_FOUND);
		}
		return user;
	}
}
