import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	  ) {}

	async validateUser(payload: any): Promise<User> {
		return this.usersService.findByUsername(payload.username);
	}

  // Generates a JWT payload with the user's userName and id, and then uses the JwtService to sign this payload and generate a JWT
  async login(user: User) {
    const payload = { username: user.userName, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
