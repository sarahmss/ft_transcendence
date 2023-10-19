import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(userId: string): Promise<User>;
    create(user: User): Promise<User>;
    update(userId: string, user: User): Promise<any>;
    delete(userId: string): Promise<any>;
}
