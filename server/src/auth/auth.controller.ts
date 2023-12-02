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
import { CreateUserDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {

	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService,
		private logger: Logger = new Logger('Auth')
		) {}

	/********************************* POST ******************************/

	@Post('signup')
	signup(@Res() response: Response,
		@Body() data: CreateUserDto) {
		this.logger.log( 'GET: auth/signup');
		return this.usersService.createLocalUser(data, response);
	}

	@Post('signin')
	signin(@Res() response: Response,
			@Body() data: Partial<User>) {
		this.logger.log( 'GET: auth/signin');
		this.authService.LocalLogin(response, data);
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
	intraCallback(@Res() response: Response,
				@Req() request: UserRequest) {
		this.logger.log( 'GET: auth/callback');
		this.authService.IntraLogin(response, request.user);
	}

	@Get('logout')
	async logoutUser(@Res() response: Response) {
		this.logger.log( 'GET: auth/logout');
		await this.authService.logout(response).then(() => response.redirect(
													process.env.FRONT_URL));
	}
}
