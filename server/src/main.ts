import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import * as passport from 'passport';
import { ftSession } from './helpers/types.helper'
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app: INestApplication = await NestFactory.create(AppModule);
	const port = process.env.BACK_PORT;
	const corsOptions = {
		origin: [process.env.FRONT_URL, 'http://api.intra.42.fr', process.env.BACK_URL],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	}

	app.useWebSocketAdapter(new IoAdapter(app));
	app.enableCors(corsOptions);
	app.use(ftSession);
	app.use(passport.initialize());
	app.use(passport.session());
	app.useGlobalPipes(new ValidationPipe);
	await app.listen(port,
						() => console.log((`Running in port ${port} !`))
					);
}
bootstrap();
