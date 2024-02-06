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
import { HideMessageService } from './service/hide-message/hide-message.service';
import { HideMessage } from 'src/entity/hideMessage.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { BlacklistController } from './controller/blacklist/blacklist.controller';
import { BanService } from './service/ban/ban.service';
import { BanController } from './controller/ban/ban.controller';
import { Ban } from 'src/entity/ban.entity';
import { InviteService } from './service/invite/invite.service';
import { InviteController } from './controller/invite/invite.controller';
import { Invite } from 'src/entity/invite.entity';
import { AdminController } from './controller/admin/admin.controller';

@Module({
	imports: [ 
		TypeOrmModule.forFeature([
										Invite,
										Message,
										Room,
										DirectRoom,
										GroupRoom,
										BlackList,
										Membership,
										User,
										HideMessage,
										Ban,
		]),
		AuthModule
	],

	controllers: [
		RoomController,
		MessageController,
		BlacklistController,
		BanController,
		InviteController,
		AdminController
	],

	providers: [
		RoomGateway,
		RoomService,
		BlacklistService,
		MessageService,
		MembershipService,
		UsersService,
		HideMessageService,
		ConnectedUserService,
		BanService,
		InviteService,
	],

})
export class ChatModule {}
