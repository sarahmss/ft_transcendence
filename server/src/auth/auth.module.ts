import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { IntraStrategy } from './strategies/intra.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { 2FaAuthController } from './2fa/2fa-auth.controller';
// import { 2FaAuthService } from './2fa/2fa-auth.service';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: 'secret',
			signOptions: { expiresIn: '155520000s' }
		})
	],
	providers: [AuthService, IntraStrategy, JwtStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
