import { Module,
		MiddlewareConsumer,
		RequestMethod,
		NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/midlleware/auth.midlleware';
import { PassportModule } from '@nestjs/passport';
import { UploadsModule } from './uploads/upload.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule.register({ session: true }),
		UsersModule,
		UploadsModule,
		AuthModule,
		ChatModule,
		GameModule,
		TypeOrmModule.forRoot({
			type: process.env.DB_TYPE as any,
			host: process.env.PG_HOST,
			port: parseInt(process.env.PG_PORT),
			username: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DB,
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
		}),
	],
	
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(AuthMiddleware)
		.exclude(
			{ path: '/auth/', method: RequestMethod.GET },
			{ path: '/auth/login', method: RequestMethod.GET },
			{ path: '/auth/callback', method: RequestMethod.GET },
			{ path: '/auth/logout', method: RequestMethod.GET },
			{ path: '/auth/signup', method: RequestMethod.POST },
			{ path: '/auth/signin', method: RequestMethod.POST },
			{ path: '/2fa-auth/login', method: RequestMethod.POST },
		)
		.forRoutes('');
	}
}
