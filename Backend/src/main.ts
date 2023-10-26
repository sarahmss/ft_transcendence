import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { ftSession } from './helpers/types.helper'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: process.env.FRONT_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',});
	app.use(ftSession);
	app.use(passport.initialize());
	app.use(passport.session());
	app.useGlobalPipes(new ValidationPipe);
	await app.listen(3000);
}
bootstrap();
