import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { LocalUserData } from 'src/helpers/types.helper';
import { MessagesHelper } from 'src/helpers/messages.helpers';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: 'secret',
		});
	}

	async validate(payload: any): Promise<any> {
		return payload;
	}

	// async validate( payload: any,
	// 	): Promise<any> {

	// 		const { id, username, emails } = payload;

	// 		const user: LocalUserData = {
	// 			userId: id,
	// 			userName: username,
	// 			email: emails[0].value,
	// 			profilePicture: photos[0].value,
	// 		};

	// 		if (!user) {
	// 			throw new HttpException(MessagesHelper.USER_NOT_FOUND,
	// 									HttpStatus.NOT_FOUND);
	// 		}
	// 		return user;
	// 	}
}
