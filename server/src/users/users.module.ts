import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Friends } from '../entity/friends.entity';
import { Module, Logger } from '@nestjs/common';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Friends]),
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
