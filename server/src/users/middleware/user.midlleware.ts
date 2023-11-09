import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { Injectable,
		UnauthorizedException,
		NestMiddleware,} from '@nestjs/common';

@Injectable()
	export class SignInMidlleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const existingUsernameUser = await this.usersService.findByUserName(
			req.body.userName);
		if (existingUsernameUser) {
			return res.status(400).send({ message: 'Failed! Username is already in use!' });
		}

		const existingEmailUser = await this.usersService.findByEmail(
			req.body.email);
		if (existingEmailUser) {
			return res.status(400).send({ message: 'Failed! Email is already in use!' });
		}
		next();
	}
}
