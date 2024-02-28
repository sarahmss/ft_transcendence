import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
@WebSocketGateway({
	namespace: '/app',
	cors: {
		origin: process.env.FRONT_URL,
		credentials: true,
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
	@WebSocketServer() server: Server;
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly connectionsService: ConnectionsService,
	) {}
	private logger: Logger = new Logger('AppGateway');

	onModuleInit() {
		this.connectionsService.clearConnections();
	}

	afterInit() {
		this.logger.log('Init');
	}

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.headers.cookie.split('=')[1];
			const decodedToken = this.authService.IsValidJwt(token);
			const user = await this.authService.IsValidUser(decodedToken.id);
			client.data.user = user;
			await this.connectionsService.newConnection(client.id, user);
			this.setStatunOn(user);
		} catch {
			client.emit('error', new UnauthorizedException());
			this.disconnect(client);
		}
		this.logger.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		this.setStatusOff(await client.data.user);
		this.connectionsService.removeConnection(client.id);
		this.disconnect(client);
	}

	async UpdateFriendshipStatus(ownerId: string, friendId: string, status: string) {
		this.server.emit(`friendshipStatusUpdate_${ownerId}_${friendId}`, { status });
		this.server.emit(`refresh`);
		this.logger.log(`friendshipStatusUpdate${ownerId}_${friendId}: ${status}`);
	}

	async sendRefresh(message: string) {
		this.server.emit(`refresh`, {message});
		this.logger.log(`refresh ${message}`);
	}

	private disconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		client.disconnect();
	}

	async setStatunOn(user: User) {
		await this.usersService
			.setStatusOn(user.userId)
			.then(() => this.sendRefresh(`${user.userName} connect` ));
	}

	private async setStatusOff(user: User) {
		if (!user) {
			return;
		}
		if (await this.connectionsService.hasConnections(user)  === false) {
			return;
		}
		await this.usersService.setStatusOff(user.userId)
		.then(() => this.sendRefresh(`${user.userName} disconnect` ));;
	}

	async setStatusPlaying(user1: string, user2: string) {
		await this.usersService .setStatusPlaying(user1)
		.then(() => this.sendRefresh(`${user1} Playing` ));
		
		await this.usersService.setStatusPlaying(user2)
		.then(() => this.sendRefresh(`${user2} Playing` ));
	}

}
