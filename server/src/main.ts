import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import * as passport from 'passport';
import { ftSession } from './helpers/types.helper'

async function bootstrap() {
	const app: INestApplication = await NestFactory.create(AppModule);

	const corsOptions = {
		origin: [process.env.FRONTEND_URL, 'http://api.intra.42.fr'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	}

	app.enableCors(corsOptions);
	app.use(ftSession);
	app.use(passport.initialize());
	app.use(passport.session());
	app.useGlobalPipes(new ValidationPipe);
	await app.listen(process.env.PORT);
}
bootstrap();
