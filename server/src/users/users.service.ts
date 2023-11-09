import { Injectable,
	NotFoundException,
	UnprocessableEntityException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UpdateUserDto } from "./dto/user.dto";
import { status } from "../helpers/types.helper"
import { IntraUserData, UserHelper } from '../helpers/types.helper';
@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	/********************************* FIND ******************************/
	async findAll(): Promise<User[]> {
		return this.usersRepository.find({
		select: ["userId", "userName", "email", "profilePicture"]
	});
	}

	async findById(userId: string): Promise<User> {
		return this.usersRepository.findOneBy({ userId });
	}

	async findByIdOrFail(userId: string): Promise<User> {
		return this.usersRepository.findOneByOrFail({ userId });
	}

	async findByUserName(userName: string): Promise<User> {
		return this.usersRepository.findOneBy({ userName});
	}

	async findByExternalId(externalId: number): Promise<User> {
		return this.usersRepository.findOneBy({ externalId });
	}

	async findByEmail(email: string): Promise<User> {
		return await this.usersRepository.findOneBy({ email });
	}

	/********************************* GET ******************************/

	async getUser(userId: string)
	{
		const user = await this.checkUser(userId);
		return {
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			externalId: user.externalId,
			profilePicture: user.profilePicture,
			status: user.status,
			hasTwoFactorAuth: user.has2FaAuth,
		};
	}

	async getUserProfile(userId: string)
	{
		const user = await this.checkUser(userId);
		return {
			userName: user.userName,
			profilePicture: user.profilePicture,
			status: user.status,
		};
	}

	async getUserStatus(userId: string): Promise<status>
	{
		const user = await this.checkUser(userId);
		return user.status;
	}

	async getUserSecret(userId: string): Promise<string>
	{
		const user = await this.checkUser(userId);
		return user.password;
	}

	/********************************* SET ******************************/

	private async setStatus(userId:string, status: status): Promise<User> {
		const user = await this.checkUser(userId);
		user.status = status;
		return this.usersRepository.save(user);
	}

	async setStatusOn(userId: string): Promise<User> {
		return this.setStatus(userId, status.ON);
	}

	async setStatusOff(userId: string): Promise<User> {
		return this.setStatus(userId, status.OFF);
	}

	async setStatusPlaying(userId: string): Promise<User> {
		return this.setStatus(userId, status.PLAYING);
	}

	async setUserSecret(userId: string, password: string): Promise<User> {
		const user = await this.checkUser(userId);
		user.password = password;
		return this.usersRepository.save(user);
	}

	async SetTwoFactorAuthOn(userId: string) {
		const user = await this.checkUser(userId);
		user.has2FaAuth = true;
		this.usersRepository.save(user);
	}

	async SetTwoFactorAuthOff(userId: string) {
		const user = await this.checkUser(userId);
		user.has2FaAuth = false;
		this.usersRepository.save(user);
	}
	/********************************* VALIDATE ******************************/

	async isValidSigin(email: string, userName: string)
	{
		const validUserEmail = await this.findByEmail(email);
		const validUserName = await this.findByUserName(userName);
		if (validUserEmail) {
			console.log('Inalid user email: ',validUserEmail.email)
			return (false);
		}
		if (validUserName) {
			console.log('Inalid user email: ', validUserName.userName);
			return (false);
		}
		return (true);
	}

	private async checkUser(userId: string) {
		const user = await this.findById(userId);
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}

	async validateIntraUser(IntraUser: IntraUserData) {
		const user = await this.findByExternalId(IntraUser.externalId);
		if (user){
			return user;
		}
		return this.createIntraUser(IntraUser);
	}

	async NameisNotUnique(userName: string) {
		if (!userName) {
			return false;
		}
		const user = await this.findByUserName(userName)
		if (user) {
			return true;
		}
		return false;
	}

	/********************************* TOOLS ******************************/

	async createIntraUser(userData: IntraUserData): Promise<User> {
		let picture = userData.profilePicture;
		if (picture == null) {
			picture = UserHelper.TEMP_PROFILE_PICTURE;
		}
		const newUser: User = this.usersRepository.create({
			userName: userData.userName,
			email: userData.email,
			externalId: userData.externalId,
			profilePicture: picture,
		});
		return this.usersRepository.save(newUser);
		}

		async update(userId: string, userDto: UpdateUserDto): Promise<User> {
			const user = await this.checkUser(userId);
			const invalidUpdate = await this.NameisNotUnique(userDto.userName);
			if (invalidUpdate){
				throw new UnprocessableEntityException();
			}
			this.usersRepository.merge(user, userDto);
			return this.usersRepository.save(user);
		}

		async delete(userId: string): Promise<void> {
			const user = await this.checkUser(userId);
			await this.usersRepository.delete(user.userId);
		}

		async createLocalUser(user: User) {
			const isValidUser = await this.isValidSigin( user.email,
														user.userName);
			if (isValidUser == false)
				throw new UnprocessableEntityException();
			const newuser = this.usersRepository.create(user);
			return this.usersRepository.save(newuser);
		}
}
