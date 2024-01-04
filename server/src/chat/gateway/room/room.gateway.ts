
import { OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer } from '@nestjs/websockets';

import { MessageService } from 'src/chat/service/message/message.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor( private readonly authService: AuthService,
				 private readonly userService: UsersService,
				 private readonly membershipService: MembershipService,
				 private readonly messageService: MessageService ) {}

	@WebSocketServer() server: Server;

	users: number = 0;

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			const userId: string = this.authService.IsValidJwt(client.handshake.auth['jwt']);
			const user = await this.userService.getUser(userId);
			if (!user)
				this.handleDisconnect(client);
			else {
				const rooms = this.membershipService.findMemberRooms(userId);
				this.server.to(client.id).emit("room_list", rooms);
			}
		} catch {
			this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {
		client.disconnect();
	}

	// Payload is data sent by the client
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		/*
		this.messageService.createMessage(payload.message,
										 payload.room,
										 payload.user);
		*/
		console.log(payload);
		// this.server.to(payload.room).emit();
		this.server.emit("message-response", payload)
	}

	@SubscribeMessage('create-room')
	handleRoomCreation(client: Socket, roomInfo: any) {
	}

	@SubscribeMessage('join-room')
	handleRoomJoin(client: Socket, roomInfo: any) {
	}

	@SubscribeMessage('leave-room')
	handleRoomLeave(client: Socket, roomInfo: any) {
	}

	@SubscribeMessage('refresh')
	refreshRoom(client: Socket, roomInfo: any) {
	}
}
