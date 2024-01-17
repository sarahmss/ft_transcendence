
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

import { BlacklistService } from 'src/chat/service/blacklist/blacklist.service';

import { createMessage } from 'src/chat/dto/Message.dto';
import { Room } from 'src/entity/room.entity';
import { ForbiddenException } from '@nestjs/common';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';

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
		private readonly blackListService: BlacklistService,
		private readonly connectedUserService: ConnectedUserService,
	) {}

	@WebSocketServer() server: Server;

	private joinRooms(client: Socket, rooms: Set<string>): void {

		// Join in all rooms
		if (rooms.size !== 0)
			rooms.forEach((room) =>
				client.join(room)
			);

		else {
			console.log("the user it's not in any room");
		}
	}

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

			let roomSet: Set<string> = new Set();
			this.connectedUserService.addConnection(user.userId, client);

			const membershipRoom: Membership[] = await this.membershipService
																												.findMemberRooms(user.userId);

			membershipRoom.forEach((room) => {
				roomSet.add(room.roomId);
			});

			client.emit("room-list", roomSet);
			this.joinRooms(client, roomSet);
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

	// Payload is data sent by the client
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		
		// this.server.to(payload.room).emit("message-response", message_created);
		// this.server.to(payload.room).emit();
		client.emit("client-response", payload);
		this.connectedUserService.getConnection(client.data.userId).emit("client-response", "service working");
		this.server.emit("message-response", payload);
	}

	// Emit the joined room to the client to append on room list of the client
	@OnEvent('room.join')
	sendRoomListUser(userId: string, room: Room) {

		this.connectedUserService
			.getConnection(userId)
			.emit("joined", room);
	}
	
	// Will listen the event emitted by the emitter in the controller
	@OnEvent('message.create')
	async handleMessageCreation(message: createMessage) {

		let receivingClients: any;

		const participantList = await this.membershipService.findParticipants(message.room.roomId);
		const blackList = await this.blackListService.getBlockedUser(message.user);

		if (blackList.length > 0) {
			// If there is someone blocked => filter and get the allowed users
			receivingClients = participantList.filter(
				(participant) =>
					!blackList.some((blocked) =>
						participant.userId === blocked.blocked_user.userId));
		}
		else
			// If everyone is allowed get everyone
			receivingClients = participantList;

		// Emit to a specific room
		// Blacklist condition for trasnmission will be written here
		// Since we cannot emit to message to those who are inside the blacklist
		receivingClients.forEach((membershipData: Membership) => {
			let targetSocket: Socket = this.connectedUserService.getConnection(membershipData.userId);
			if (targetSocket)
					targetSocket.to(message.room.roomId).emit("message_response", message);
		})
	}
}
