import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guards';
import { Response } from 'express';
import { UserRequest } from '../helpers/types.helper'
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {

	constructor(
		private authService: AuthService,
		private logger: Logger = new Logger('Auth')
		) {}

	/********************************* GET ******************************/
	@Get()
	async getAuth() {
		this.logger.log( 'GET: /auth');
	}

	@Get('login')
	@UseGuards(IntraGuard)
	intraLogin(){
		this.logger.log( 'GET: auth/login');
		return ;
	}

	@Get('callback')
	@UseGuards(IntraGuard)
	intraRedirect(@Res() response: Response,
				@Req() request: UserRequest) {
		this.logger.log( 'GET: auth/callback');
		this.authService.login(response, request.user);
	}

	@Get('logout')
	async logoutUser(@Res() response: Response) {
		this.logger.log( 'GET: auth/logout');
		await this.authService.logout(response).then(() => response.redirect(
													process.env.FRONT_URL));
	}

}
