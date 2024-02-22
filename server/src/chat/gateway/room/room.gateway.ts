
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

import { Membership } from 'src/entity/membership.entity';

import { ForbiddenException } from '@nestjs/common';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
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
			let token: string = null;

			if (client.handshake.auth.token)
				token = client.handshake.auth.token;

			else if (client.handshake.headers.cookie)
				token = client.handshake.headers.cookie.split('=')[1];

			else if (client.handshake.headers.jwt)
				token = <string> client.handshake.headers.jwt; 

			user = await this.checkUser(token); 

			client.data.user = user;
			this.connectedUserService.addConnection(user.userId, client);
		}
		catch (error) {
			console.log("User auth failure");
			this.handleDisconnect(client);
		}
	}

	handleDisconnect(client: Socket) {

		if (client.data.user && client.data.user.userId)
			this.connectedUserService
				.removeConnection(client.data.user.userId);

		client.disconnect();
		console.log("User disconnected");
	}

	// Test listener
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		
		client.emit("redirTest", {gameId: "something"});
		// const socket = this.connectedUserService
		// 											.getConnection(client.data.user.userId);

		// socket.emit("client-response", "service working");

		// this.server.emit("message-response", payload);
	}

	// Join => event name: joined
	// Leave => event name: left
	// Create => event name: joined
	// Delete => event name: left
	@OnEvent('room.join')
	@OnEvent('room.leave')
	@OnEvent('room.admin')
	@OnEvent('room.delete')
	@OnEvent('room.private')
	@OnEvent('room.pass')
	emitRoomToAllMembers(users: any[], room: any, emission_event: string, cb: any) {

		users.forEach((user: any) => {
			const conn = this.connectedUserService.getConnection(user.userId);
			if (conn) {
				const data = cb(user, room);
				conn.emit(emission_event, data);
			}
		});
	}

	@OnEvent('game.invitation.send')
	@OnEvent('room.create')
	emitRoom(users: any[], room: any, emission_event: string, cb: any) {

		users.forEach((user: any) => {
			const conn = this.connectedUserService.getConnection(user);
			if (conn) {
				const data = cb(user, room);
				conn.emit(emission_event, data);
			}
		});
	}

	@OnEvent('invite-send')
	@OnEvent('invitation-used')
	emitInvite(targetId: string, data: any, emission_event: string) {
		const conn = this.connectedUserService.getConnection(targetId);

		if (conn)
			conn.emit(emission_event, { data: data });
		
	}

	// Will listen the event emitted by the emitter in the controller
	@OnEvent('message.create')
	async handleMessageEmission(
		messageResp: any,
		blackList: any[],
		participantList: any[],
		banList: any[],
		event: string = "message-response"
	) {

		let receivingClients: any;

		if (blackList.length > 0 || banList.length > 0) {
			// If there is someone blocked => filter and get the allowed users
			receivingClients = participantList.filter(
				(participant: Membership) =>
					!blackList.some((blocked: BlackList) =>
						(participant.userId === blocked.blockedId ||
						participant.userId === blocked.blockerId) &&
						participant.userId !== messageResp.authorId)
					&&
					!banList.some((banEntry: Ban) =>
						(banEntry.bannedId === participant.userId))
				);
		}
		else {
			// If there is no one blocked
			receivingClients = participantList;
		}

		await this.sendToMembers(messageResp, receivingClients, event);

	}

	@OnEvent('broadcast.delete')
	@OnEvent('broadcast.update')
	async sendToMembers (
		messageResp: any,
		receivingClients: any[],
		event: string
	) {
		// Emit the message to the user
		receivingClients.forEach((membershipData: Membership) => {
			let targetSocket: Socket = this.connectedUserService
																				.getConnection(membershipData.userId);
			if (targetSocket) {
				targetSocket.emit(event, messageResp);
			}
		});
	}
}
