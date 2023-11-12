import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	/********************************* TOOLS ******************************/
	async IntraLogin(response: any, intraUser: any): Promise<any> {
		const user: User = await this.usersService.validateIntraUser(intraUser);
		if (user.has2FaAuth) {
			return response.redirect(process.env.FRONT_URL + `/2fa?user=${user.userId}`);
		}
		const userId = { id: user.userId };
		response.cookie('accessToken', this.jwtService.sign(userId), {
			sameSite: 'Lax',
		});
		return response.redirect(process.env.FRONT_URL + '/user');
	}

	async LocalLogin(response: any, intraUser: any): Promise<any> {
		const user: User = await this.usersService.validateLocalUser(intraUser);
		if (user.has2FaAuth) {
			return response.redirect(process.env.FRONT_URL + `/2fa?user=${user.userId}`);
		}
		const userId = { id: user.userId };
		response.cookie('accessToken', this.jwtService.sign(userId), {
			sameSite: 'Lax',
		});
		return response.redirect(process.env.FRONT_URL + '/user');
	}

	async logout(response: any): Promise<any> {
		response.clearCookie('accessToken', { sameSite: 'Lax' });
	}

	/********************************* VALIDATE ******************************/
	IsValidJwt(jwt: string) {
		return this.jwtService.verify(jwt);
	}

	async IsValidUser(userId: string) {
		return this.usersService.findByIdOrFail(userId);
	}
}
