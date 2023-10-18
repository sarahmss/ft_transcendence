import { Injectable,
	UnauthorizedException,
	UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(userId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { userId } });
  }

  async findByUsername(userName: string): Promise<User> {
    return this.usersRepository.findOneBy({ userName });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newuser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newuser);
  }

  async register(userName: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ userName });

    if (existingUser) {
      throw new UnprocessableEntityException('Username already exists');
    }
	const user = new User();
    user.userName = userName;
    user.password = password; //make sure to hash the password before storing it

    return this.usersRepository.save(user);
  }

  async validateUser(userName: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userName });

    if (!user || user.password !== password) { // make sure to hash the password and compare the hashed values
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async update(userId: string, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(userId, user);
    return this.usersRepository.findOne({ where: { userId } });
  }

  async delete(userId: string): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}
