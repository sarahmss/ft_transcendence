import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { FortyTwoStrategy } from './strategies/FortyTwo.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFaAuthController } from './2fa/2fa-auth.controller';
import { TwoFaAuthService } from './2fa/2fa-auth.service';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '7d' }
		})
	],
	providers: [AuthService,
		FortyTwoStrategy,
		JwtStrategy,
		TwoFaAuthService,
		Logger],
	controllers: [AuthController, TwoFaAuthController],
	exports: [AuthService],
})
export class AuthModule {}
