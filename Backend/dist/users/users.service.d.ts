import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User>;
    findByUsername(userName: string): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    register(userName: string, password: string): Promise<User>;
    update(userId: string, user: Partial<User>): Promise<User>;
    delete(userId: string): Promise<void>;
}
