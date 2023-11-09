import { Request, Response, NextFunction } from 'express';
import { Injectable,
		NestMiddleware,} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
	export class SignInMidlleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const isValidUser = await this.usersService.isValidSigin(
			req.body.email,
			req.body.userName);
		if (isValidUser == false)
			return res.status(400).send({ message: 'Failed! Username or email is already in use!' });
		next();
	}
}
