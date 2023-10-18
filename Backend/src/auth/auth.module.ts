import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
//import { LocalStrategy } from './strategies/local.strategy';
//import { LoginValidationMiddleware } from './middlewares/login-validation.middleware';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
		  secret: process.env.JWT_SECRET,
		  signOptions: { expiresIn: '30d' },
		}),
	  ],
	  controllers: [AuthController],
	  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
