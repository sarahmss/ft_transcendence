import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import {UpdateUserDto} from "./dto/user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //get user by userId
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }


  //update user
  @Put(':userId')
  async update (@Param('userId') userId: string, @Body() user: User): Promise<any> {
    return this.usersService.update(userId, user);
  }

  //delete user
  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<any> {
    //handle error if user does not exist
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(userId);
  }
}
