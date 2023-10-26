import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guards';
import { Response } from 'express';
import { UserRequest } from '../helpers/types.helper'

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) {}

	@Get('login')
	@UseGuards(IntraGuard)
	intraLogin(){
		return ;
	}

	@Get('callback')
	@UseGuards(IntraGuard)
	intraRedirect(@Res() response: Response,
				@Req() request: UserRequest) {
		this.authService.login(response, request.user);
	}

	@Get('status')
	getUserStatus(@Res() response: Response) {
		response.sendStatus(200);
	}

	@Get('logout')
	async logoutUser(@Res() response: Response) {
		await this.authService.logout(response).then(() => response.redirect(
													process.env.FRONT_URL));
	}

}
