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
		const token = this.jwtService.sign({ id: user.userId });
		response.cookie('accessToken', token, {
			sameSite: 'Lax',
		});

		return response.status(200).send({
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			accessToken: token
		});
	}

	async LocalLogin(response: any, data: Partial<User>): Promise<any> {
		const user: User = await this.usersService.validateLocalUser(data);
		if (user.has2FaAuth) {
			return response.redirect(process.env.FRONT_URL + `/2fa?user=${user.userId}`);
		}
		const token = this.jwtService.sign({ id: user.userId });
		response.cookie('accessToken', token, {
			sameSite: 'Lax',
		});

		return response.status(200).send({
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			accessToken: token
		});
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
