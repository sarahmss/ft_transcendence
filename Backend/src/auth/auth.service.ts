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

	async login(response: any, intraUser: any): Promise<any> {
		const user: User = await this.usersService.validateIntraUser(intraUser);
		if (user.hasTwoFactorAuth) {
			return response.redirect(process.env.FRONT_HOST + `/2fa?user=${user.userId}`);
		}
		const payload = { id: user.userId };
		response.cookie('accessToken', this.jwtService.sign(payload), {
			sameSite: 'Lax',
		});
		return response.redirect(process.env.FRONT_HOST);
	}

	async logout(response: any): Promise<any> {
		response.clearCookie('accessToken', { sameSite: 'Lax' });
	}

	validateJwt(jwt: string) {
		return this.jwtService.verify(jwt);
	}

	async validateUser(userId: string) {
		return this.usersService.findByIdOrFail(userId);
	}
}
