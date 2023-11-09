import { Controller,
			Get,
			Post,
			Req,
			Res,
			UseGuards,
			Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './guards/FortyTwo.guard';
import { Response } from 'express';
import { UserRequest } from '../helpers/types.helper'
import { Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';

@Controller('auth')
export class AuthController {

	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService,
		private logger: Logger = new Logger('Auth')
		) {}

	/********************************* POST ******************************/

	@Post('signup')
	async create(@Res() response: Response, @Req() request: UserRequest) {
		try {
			const newUser = await this.usersService.createLocalUser(request.user);
			this.logger.log( `POST signup: created ${newUser.userId}`);
			return(newUser);
		} catch {
			return response.status(400).send({ message: 'Failed! Username or email is already in use!' });
		}
	}

	@Post('signin')
	async login(@Body() user: User) {
		console.log("Sign in");
	}

	/********************************* GET ******************************/
	@Get()
	async getAuth() {
		this.logger.log( 'GET: /auth');
	}

	@Get('login')
	@UseGuards(FortyTwoGuard)
	intraLogin(){
		this.logger.log( 'GET: auth/login');
		return ;
	}

	@Get('callback')
	@UseGuards(FortyTwoGuard)
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
