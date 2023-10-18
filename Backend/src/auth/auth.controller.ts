import { Body, Controller, Post,
		Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

	// Respond with instructions for the client to delete the JWT
	@Post('logout')
	logout() {
		return { message: 'Please delete your JWT' };
	}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user);
  }

  //  This endpoint will validate the user's credentials and return a JWT.
  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.userService.validateUser(username, password);
    return this.authService.login(user);
  }
}

@Controller('protected')
export class ProtectedController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProtectedResource() {
    // This route is protected by the AuthGuard with the 'jwt' strategy
    // If the request includes a valid JWT, this handler will be called
    // If not, the request will be denied
  }
}
