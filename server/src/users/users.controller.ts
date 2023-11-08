import { Controller,
		ParseUUIDPipe,
		Get,
		Post,
		Body,
		Patch,
		Param,
		Delete,
		NotFoundException,
		HttpCode} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import {UpdateUserDto} from "./dto/user.dto";
import { Logger } from '@nestjs/common';


@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private logger: Logger = new Logger('Users')
		) {}

	/********************************* GET ******************************/
	@Get()
	async findAll(): Promise<User[]> {
		this.logger.log( 'Get: users');
		return this.usersService.findAll();
	}

	@Get(':userId')
	async findById( @Param('userId', ParseUUIDPipe) userId: string ) {
		this.logger.log( `GET: ${userId}`);
		return this.usersService.getUser(userId);
	}

	@Get(':userId/profile')
	async getUserProfile( @Param('userId', ParseUUIDPipe) userId: string ) {
		this.logger.log( `GET Profile: ${userId}`);
		return this.usersService.getUser(userId);
	}

	/********************************* POST ******************************/

	@Post('local')
	async create(@Body() user: User): Promise<User> {
		this.logger.log( `POST local: ${user.userId}`);
		return this.usersService.create(user);
	}

	/********************************* PATCH ******************************/

	@Patch(':userId')
	@HttpCode(204)
	async update (
				@Param('userId', ParseUUIDPipe) userId: string,
				@Body() userDto: UpdateUserDto): Promise<any> {
		this.logger.log( `PATCH : ${userId}`);
		return this.usersService.update(userId, userDto);
	}

	/********************************* DELETE ******************************/

	@Delete(':userId')
	async delete(@Param('userId') userId: string): Promise<any> {
		return this.usersService.delete(userId);
	}
}
