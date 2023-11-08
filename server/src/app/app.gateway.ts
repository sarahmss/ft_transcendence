import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
@WebSocketGateway({
	namespace: '/session',
	cors: {
		origin: process.env.FRONT_URL,
		credentials: true,
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('status')
	handleStatus(client: Socket, message: string) {
		client.emit('status', message);
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
			this.setStatunOn(user);
		} catch {
			client.emit('error', new UnauthorizedException());
			this.disconnect(client);
		}
		this.logger.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		this.setStatusOff(await client.data.user);
		this.disconnect(client);
	}


	private disconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		client.disconnect();
	}

	async setStatunOn(user: User) {
		this.usersService
			.setStatusOn(user.userId);
	}

	private async setStatusOff(user: User) {
		if (!user) {
			return;
		}
		this.usersService
			.setStatusOff(user.userId);
	}
}
