
import { Request, NextFunction, Response } from 'express';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException, NestMiddleware,} from '@nestjs/common';

	@Injectable()
	export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) {}

	async use(request: Request, response: Response, next: NextFunction) {
		try {
			const token = request.headers['authorization'].split(' ')[1];
			const decodedToken = this.authService.validateJwt(token);
			const user = await this.authService.validateUser(decodedToken.id);
			request.user = user.userId;
			next();
		} catch {
			throw new UnauthorizedException();
		}
	}
	}
