import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { DirectRoom, GroupRoom, Room } from 'src/entity/room.entity';
import { RoomController } from './controller/room/room.controller';
import { RoomGateway } from './gateway/room/room.gateway';
import { RoomService } from './service/room/room.service';
import { BlacklistService } from './service/blacklist/blacklist.service';
import { MessageService } from './service/message/message.service';
import { MessageController } from './controller/message/message.controller';
import { MembershipService } from './service/membership/membership.service';
import { BlackList } from 'src/entity/blacklist.entity';
import { Membership } from 'src/entity/membership.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [ 
		TypeOrmModule.forFeature([Message,
										Room,
										DirectRoom,
										GroupRoom,
										BlackList,
										Membership,
										User]),
		AuthModule
	],

	controllers: [
		RoomController,
		MessageController
	],

	providers: [
		RoomGateway,
		RoomService,
		BlacklistService,
		MessageService,
		MembershipService,
		UsersService,
	],

})
export class ChatModule {}
