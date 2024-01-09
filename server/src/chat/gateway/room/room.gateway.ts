
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
import { OnEvent } from '@nestjs/event-emitter';
import { createMessage } from 'src/chat/dto/Message.dto';

@WebSocketGateway({
	namespace: "room",
	cors: {
		origin: process.env.FRONT_URL,
		credentials: true,
	},
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor( private readonly authService: AuthService,
				 private readonly userService: UsersService,
				 private readonly membershipService: MembershipService,
				 private readonly messageService: MessageService ) {}

	@WebSocketServer() server: Server;

	// UserId and socketId pair
	private connected_users: Map<string, Socket> = new Map();
 	quant_users: number = 0;

	async handleConnection(client: Socket, ...args: any[]) {
		// Authentication via jwt token sent by the client
		try {
			const userId: string = this.authService.IsValidJwt(<string>client.handshake.headers.jwt);
			console.log(userId);
			const user = await this.userService.getUser(userId);

			if (!user)
				this.handleDisconnect(client);

			else {
				const rooms = this.membershipService.findMemberRooms(userId);
				client.emit("room_list", rooms);
			}

			this.connected_users.set(user.userId, client);
		}
		catch {
		 this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {
		// this.connected_users.delete();
		client.disconnect();
	}

	// Payload is data sent by the client
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		
		// const message_created = this.messageService.createMessage(payload.message,
		// 																													 payload.room,
		// 																													 payload.user);
		// if (!message_created)
		// 	throw new Exception

		// this.server.to(payload.room).emit("message-response", message_created);
		
		console.log(client);
		// this.server.to(payload.room).emit();
		this.server.emit("message-response", payload);
	}


	@OnEvent('room.get')
	sendRoomListUser(userId: string) {
		
	}
	
	@OnEvent('message.create')
	handleMessageCreation(message: createMessage) {
		// Emit to a specific room
		this.server.to(message.room.roomId).emit("message_response", message);
	}
}
