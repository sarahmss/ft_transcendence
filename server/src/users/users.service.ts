import { Injectable,
	NotFoundException,
	UnprocessableEntityException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UpdateUserDto, CreateUserDto } from "./dto/user.dto";
import { status } from "../helpers/types.helper"
import { IntraUserData, UserHelper } from '../helpers/types.helper';
import * as bcrypt from 'bcrypt';
import * as xssFilters from 'xss-filters';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	/********************************* FIND ******************************/
	async findAll(): Promise<User[]> {
		return this.usersRepository.find({ select: ["userId", "userName", "email", "profilePicture"] });
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

	async findByEmail(email: string): Promise<User> {
		return this.usersRepository.findOneBy({ email });
	}

	async findByExternalId(externalId: number): Promise<User> {
		return this.usersRepository.findOneBy({ externalId });
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
	
	async getUserStats(userId: string) {
		await this.checkUser(userId);
		const user = await this.usersRepository.findOne({ 
			where: { userId:  userId},
			relations: ['losingGames',
						'winningGames',
						'winningGames.winner',
						'winningGames.loser',
						'losingGames.winner',
						'losingGames.loser'],
		});
	
		return {
			userName: user.userName,
			level: user.level,
			gamesWonToLevelUp: user.gamesWonToLevelUp,
			totalGamesWon: user.totalGamesWon,
			totalGamesLost: user.totalGamesLost,
			victories: user.winningGames.map(game => ({
				gameId: game.gameId,
				winnerScore: game.winnerScore,
				loserScore: game.loserScore,			
				gameTime: game.gameTime,
				winner: {
					userId: game.winner.userId,
					userName: game.winner.userName,
					profilePicture: game.winner.profilePicture
				},
				loser: {
					userId: game.loser.userId,
					userName: game.loser.userName,
					profilePicture: game.loser.profilePicture
				}
			})),
			defeats: user.losingGames.map(game => ({
				gameId: game.gameId,
				winnerScore: game.winnerScore,
				loserScore: game.loserScore,			
				gameTime: game.gameTime,
				winner: {
					userId: game.winner.userId,
					userName: game.winner.userName,
					profilePicture: game.winner.profilePicture
				},
				loser: {
					userId: game.loser.userId,
					userName: game.loser.userName,
					profilePicture: game.loser.profilePicture
				}
			})),
			matches: user.totalGamesWon + user.totalGamesLost
		};
	}
	
	async getAllUserStats() {
		const allUsers = await this.usersRepository.find();
	
		const allUserStats = [];
	
		for (const user of allUsers) {
			const userStats = {
				userName: user.userName,
				userId: user.userId,
				profilePicture: user.profilePicture,
				email: user.email,
				level: user.level,
				totalGamesWon: user.totalGamesWon,
				totalGamesLost: user.totalGamesLost,
				matches: user.totalGamesWon + user.totalGamesLost,
				status: user.status
			};
			
			allUserStats.push(userStats);
		}
	
		return allUserStats;
	}
	
	async getUserStatus(userId: string): Promise<status>
	{
		const user = await this.checkUser(userId);
		return user.status;
	}

	async get2FaSecret(userId: string): Promise<string>
	{
		const user = await this.checkUser(userId);
		return user.secret2Fa;
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

	async set2FaSecret(userId: string, secret: string): Promise<User> {
		const user = await this.checkUser(userId);
		user.secret2Fa = secret;
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

	async checkUser(userId: string) {
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

	async validateLocalUser(data: Partial<User>) {
		let { userName, password } = data;
		userName = xssFilters.inHTMLData(userName);
		password = xssFilters.inHTMLData(password);

		const user = await this.usersRepository.findOne({ where:
														{ userName } });
		if (!user)
			throw new UnprocessableEntityException('User Not Found!');
		const isValid = bcrypt.compareSync(password, user.password);
		if (!isValid)
			throw new UnprocessableEntityException('Invalid Password!');
		return (user);
	}


	async NameisNotUnique(newUserName: string, oldUserName:string) {

		if (!newUserName || newUserName == oldUserName) {
			return false;
		}
		const user = await this.findByUserName(newUserName)
		if (user) {
			return true;
		}
		return false;
	}

	/********************************* TOOLS ******************************/

	async createLocalUser(data: CreateUserDto, response: any) {
		let { userName, password, email } = data;
		userName = xssFilters.inHTMLData(userName);
		password = xssFilters.inHTMLData(password);
		email = xssFilters.inHTMLData(email);

		const user = await this.usersRepository.findOne({ where:
														{ userName } });
		if (user)
			throw new UnprocessableEntityException('User already exists');
		const hashedPassword = bcrypt.hashSync(password, 10);
		const newUser = this.usersRepository.create({
													userName: userName,
													password: hashedPassword,
													email: email,
													profilePicture: UserHelper.TEMP_PROFILE_PICTURE
												});
		response.send({ message: "User was registered successfully!" });
		return this.usersRepository.save(newUser);
	}

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
			const invalidUpdate = await this.NameisNotUnique(userDto.userName, user.userName);
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

}
