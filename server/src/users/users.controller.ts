import { Controller,
		ParseUUIDPipe,
		Get,
		Res,
		Body,
		Patch,
		Param,
		Delete,
		HttpCode,
		Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import {UpdateUserDto} from "./dto/user.dto";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		) {}

	/********************************* GET ******************************/
	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':userId')
	async findById( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUser(userId);
	}

	@Get(':userId/profile')
	async getUserProfile( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUserProfile(userId);
	}

	@Get(':userId/stats')
	async getUserStats( @Param('userId', ParseUUIDPipe) userId: string ) {
		return this.usersService.getUserStats(userId);
	}

	/********************************* PATCH ******************************/

	@Patch(':userId')
	@HttpCode(204)
	async update (
				@Param('userId', ParseUUIDPipe) userId: string,
				@Body() userDto: UpdateUserDto): Promise<any> {
		return this.usersService.update(userId, userDto);
	}

	/********************************* DELETE ******************************/

	@Delete(':userId')
	async delete(@Param('userId') userId: string): Promise<any> {
		return this.usersService.delete(userId);
	}

	/********************************* POST ******************************/


}
