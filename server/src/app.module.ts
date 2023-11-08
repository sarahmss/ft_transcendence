import { Module,
		MiddlewareConsumer,
		RequestMethod,
		NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppGatewayModule } from './app/app.gateway.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.midlleware';

@Module({
	imports: [
		ConfigModule.forRoot(),
		UsersModule,
		AuthModule,
		AppGatewayModule,
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
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(AuthMiddleware)
		.exclude(
			{ path: '/users/signup', method: RequestMethod.POST },
			{ path: '/users/signin', method: RequestMethod.POST },
			{ path: '/auth/', method: RequestMethod.GET },
			{ path: '/auth/login', method: RequestMethod.GET },
			{ path: '/auth/callback', method: RequestMethod.GET },
			{ path: '/auth/logout', method: RequestMethod.GET },
			{ path: '/2fa-auth/login', method: RequestMethod.POST },
		)
		.forRoutes('');
	}
}
