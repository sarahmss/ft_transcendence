
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';

import {
	Server,
	Socket
} from 'socket.io';

import { OnEvent } from '@nestjs/event-emitter';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MembershipService } from 'src/chat/service/membership/membership.service';
// import { MessageService } from 'src/chat/service/message/message.service';

import { Membership } from 'src/entity/membership.entity';

import { createMessage } from 'src/chat/dto/Message.dto';

// Handling blacklist will happen
// in two fashions:
// Channel level and user level
// In a channel level the user it's not connected to it
// In a user level the blocker will not be able to see the blocked

@WebSocketGateway({
	namespace: "room",
	cors: {
		origin: process.env.FRONT_URL,
		credentials: true,
	},
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
		private readonly membershipService: MembershipService,
		// private readonly messageService: MessageService,
	) {}

	@WebSocketServer() server: Server;

	// UserId and socketId pair
	private connectedUsers: Map<string, Socket> = new Map();

	private joinRooms(client: Socket, rooms: Set<string>): void {
		// Join in all rooms
		// This will change
		rooms.forEach((room) =>
			client.join(room)
		);
		
	}

	async handleConnection(client: Socket, ...args: any[]) {
		// Authentication via jwt token sent by the client
		try {
			const token: string = <string>client.handshake.headers.jwt;

			const userId: string = this.authService.IsValidJwt(token).id;
			const user = await this.userService.getUser(userId);

			if (!user) {
				this.handleDisconnect(client);
				return;
			}
			client.data.userId = userId;

			let roomSet: Set<string> = new Set();
			this.connectedUsers.set(user.userId, client);
			const membershipRoom: Membership[] = await this.membershipService.findMemberRooms(userId);

			membershipRoom.forEach((room) => {
				roomSet.add(room.roomId);
			});

			client.emit("room-list", roomSet);
			this.joinRooms(client, roomSet);
		}
		catch {
			 this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {
		this.connectedUsers.delete(client.data.userId);
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
