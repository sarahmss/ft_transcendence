
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

import { Membership } from 'src/entity/membership.entity';

import { Room } from 'src/entity/room.entity';
import { ForbiddenException } from '@nestjs/common';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { RoomService } from 'src/chat/service/room/room.service';
import { Message } from 'src/entity/message.entity';
import { BlackList } from 'src/entity/blacklist.entity';
import { Ban } from 'src/entity/ban.entity';

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
		private readonly connectedUserService: ConnectedUserService,
	) {}

	@WebSocketServer() server: Server;

	private async checkUser(token: string) {

		const userId: string = this.authService.IsValidJwt(token).id;
		const user = await this.userService.getUser(userId);

		if (!user)
			throw new ForbiddenException();

		return user;
	}

	async handleConnection(client: Socket) {

		// Authentication via jwt token sent by the client
		try {

			let user: any;

			if (client.handshake.headers.cookie) {
				const token = client.handshake.headers.cookie.split('=')[1];
				const decodedToken = this.authService.IsValidJwt(token);
				user = await this.authService.IsValidUser(decodedToken.userId);
			}
			else
				user = await this.checkUser(<string> client.handshake.headers.jwt); 

			client.data.user = user;
			this.connectedUserService.addConnection(user.userId, client);
		}
		catch {
			console.log("User auth failure");
			this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {

		this.connectedUserService
			.removeConnection(client.data.user.userId);

		client.disconnect();
		console.log("User disconnected");
	}

	// Test listener
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		
		client.emit("client-response", payload);
		this.connectedUserService.getConnection(client.data.userId).emit("client-response", "service working");
		this.server.emit("message-response", payload);
	}

	// Join => event name: joined
	// Leave => event name: left
	// Create => event name: joined
	// Delete => event name: left
	@OnEvent('room.join')
	@OnEvent('room.leave')
	@OnEvent('room.admin')
	@OnEvent('room.create')
	@OnEvent('room.delete')
	emitRoomToAllMembers(users: any[], room: any, emission_event: string, cb: any) {

		users.forEach((user: any) => {
			const conn = this.connectedUserService.getConnection(user.userId);
			if (conn) {
				const data = cb(users, room);
				conn.emit(emission_event, data);
			}
		});
	}

	// Will listen the event emitted by the emitter in the controller
	@OnEvent('message.create')
	async handleMessageEmission(message: Message,
		author: string,
		blackList: any[],
		participantList: any[],
		banList: any[]
	) {

		let receivingClients: any;

		if (blackList.length > 0) {
			// If there is someone blocked => filter and get the allowed users
			receivingClients = participantList.filter(
				(participant: Membership) =>
					(!blackList.some((blocked: BlackList) =>
						(participant.userId === blocked.blockedId ||
						participant.userId === blocked.blockerId)) &&
					!banList.some((banEntry: Ban) =>
						(banEntry.banId === participant.userId))
				));
		}
		else {
			// If there is no one blocked
			receivingClients = participantList;
		}

		// Emit the message to the user
		receivingClients.forEach((membershipData: Membership) => {
			let targetSocket: Socket = this.connectedUserService
																				.getConnection(membershipData.userId);
			if (targetSocket)
				targetSocket.emit("message-response",
													{
														message: message.message,
														messageId: message.messageId,
														messageTimestamp: message.timestamp,
														authorId: message.userId,
														author: author,
													});
		});
	}
}
