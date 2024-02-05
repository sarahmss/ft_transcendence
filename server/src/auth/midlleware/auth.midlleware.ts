
import { NextFunction, Response, Request } from 'express';
import { AuthService } from '../auth.service';
import { Injectable,
		UnauthorizedException,
		NestMiddleware,} from '@nestjs/common';
import { UserRequest } from '../../helpers/types.helper'

@Injectable()
	export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) {}

	async use(request: UserRequest, response: Response, next: NextFunction) {
		try {
			const token = request.headers['authorization'].split(' ')[1];
			const decodedToken = this.authService.IsValidJwt(token);
			const user = await this.authService.IsValidUser(decodedToken.id);
			request.user = user.userId;
			next();
		} catch {
			throw new UnauthorizedException();
		}
	}
}
