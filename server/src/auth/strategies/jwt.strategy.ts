import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { LocalUserData } from 'src/helpers/types.helper';
import { MessagesHelper } from 'src/helpers/messages.helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
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
		const user = await this.usersRepository.findOne({ where:
			{ userName } })
		if (!user) {
			throw new HttpException(MessagesHelper.USER_NOT_FOUND,
									HttpStatus.NOT_FOUND);
		}
		return user;
	}
}
