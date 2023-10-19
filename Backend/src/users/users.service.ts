import { Injectable,
	NotFoundException,
	UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../entity/user.entity';
import {UpdateUserDto} from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
		select: ["userId", "userName", "email", "profilePicture"]
	});
  }

  async findById(userId: string): Promise<User> {
	try {
		return await this.usersRepository.findOneByOrFail({userId});
	} catch (error) {
		throw new NotFoundException(error.message)
	}
}

  async findByUserName(userName: string): Promise<User> {
	try {
		return await this.usersRepository.findOneByOrFail({ userName });
	} catch (error) {
		throw new NotFoundException(error.message)
	}
  }

  async isNotUnique(userName: string) {
    if (!userName) {
		return false;
	  }
	  const name = await this.usersRepository.findOne({
		where: { userName: userName },
	  });
	  if (name) {
		return true;
	  }
	  return false;
	}


  async create(user: Partial<User>): Promise<User> {
    const newuser = this.usersRepository.create(user);
    return this.usersRepository.save(newuser);
  }

  async register(userName: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ userName });

    if (existingUser) {
      throw new UnprocessableEntityException('UserName already exists');
    }
	const user = new User();
    user.userName = userName;
    user.password = password; //make sure to hash the password before storing it

    return this.usersRepository.save(user);
  }

  async update(userId: string, userDto: UpdateUserDto): Promise<User> {
	const user = await this.findById(userId);
	const invalidUpdate = await this.isNotUnique(userDto.userName);
	if (invalidUpdate){
		throw new UnprocessableEntityException();
	}
	this.usersRepository.merge(user, userDto);
	return this.usersRepository.save(user);
}

  async delete(userId: string): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}
