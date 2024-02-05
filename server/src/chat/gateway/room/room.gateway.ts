
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
		private readonly membershipService: MembershipService,
		private readonly connectedUserService: ConnectedUserService,
		private readonly roomService: RoomService,
	) {}

	@WebSocketServer() server: Server;

	private async checkUser(token: string) {

		const userId: string = this.authService.IsValidJwt(token).id;
		const user = await this.userService.getUser(userId);

		if (!user)
			throw new ForbiddenException();

		return user;
	}

	async handleConnection(client: Socket, ...args: any[]) {

		// Authentication via jwt token sent by the client
		try {
			const user = await this.checkUser(<string> client.handshake.headers.jwt);

			client.data.userId = user.userId;

			let roomList = [];
			this.connectedUserService.addConnection(user.userId, client);

			const membershipRoom: Membership[] = await this.membershipService
																												.findMemberRooms(user.userId);

			membershipRoom.forEach((room) => {
				roomList.push(room.roomId);
			});

			client.emit("room-list", await this.roomService.findRoomWithArray(roomList));
		}
		catch {
			console.log("Connection has gone wrong!");
			this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {

		this.connectedUserService
			.removeConnection(client.data.userId);

		client.disconnect();
	}

	// Test listener
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		
		client.emit("client-response", payload);
		this.connectedUserService.getConnection(client.data.userId).emit("client-response", "service working");
		this.server.emit("message-response", payload);
	}

	// Emit the joined room to the client to append on room list of the client
	// Join => event name: joined
	// Leave => event name: left
	@OnEvent('room.join')
	@OnEvent('room.leave')
	emitRoomToSingleMember(userId: string, room: Room, emission_event: string) {

		const conn = this.connectedUserService
			.getConnection(userId);
		if (conn) {
			const data = {userId: userId, roomId: room.roomId}
			conn.emit(emission_event, data);
		}
	}

	// Create => event name: joined
	// Delete => event name: left
	@OnEvent('room.create')
	@OnEvent('room.delete')
	emitRoomToAllMembers(users: any, room: Room, emission_event: string) {

		users.forEach((user: any) => {
			const conn = this.connectedUserService.getConnection(user.userId);
			if (conn) {
				const data = {userId: user.userId, roomId: room.roomId}
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
