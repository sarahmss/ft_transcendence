import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { FriendshipService } from './friends.service';
import { FriendsController } from './friends.controller';
import { User } from '../entity/user.entity';
import { Friends } from '../entity/friends.entity';
import { AppGatewayModule } from 'src/app/app.gateway.module';

@Module({
  imports: [
    AppGatewayModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Friends]),
  ],
  controllers: [FriendsController],
  providers: [UsersService, FriendshipService],
  exports: [FriendshipService], 
})
export class FriendsModule {}
