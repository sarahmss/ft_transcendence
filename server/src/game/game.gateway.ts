import { Logger, Injectable, UnauthorizedException} from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { PlayerModel } from './game.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway ({
	namespace: '/game',
	cors: {
		origin: '*',
		credentials: true,
		methods: 'GET',
	},
})

@Injectable ()
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
		@WebSocketServer() server: Server;
		constructor( private readonly gameService: GameService,
					private readonly authService: AuthService,
				) {}

		async handleConnection(client: Socket) {
			try {
				const token = client.handshake.headers.cookie.split('=')[1];
				const decodedToken = this.authService.IsValidJwt(token);
				const user = await this.authService.IsValidUser(decodedToken.userId);
				client.data.user = user;
				this.gameService.logger.log(`Client connected: ${client.id}`);
			} catch {
				client.emit('Unauthorized', new UnauthorizedException());
				this.disconnect(client);
			}
		}

		private disconnect(client: Socket) {
			console.log(`Client disconnected: ${client.id}`);
			// client.disconnect();
		}

		handleDisconnect(client: Socket) {
			if (this.gameService.game.players[client.id]) {
			console.log(`${this.gameService.game.players[client.id].name} disconnected`);
			this.gameService.game.players[client.id].disconnected = new Date().getTime();
			const timerId = setTimeout(() => {
				this.gameService.removePlayer(client.id, client, this.server);

			}, 5000);
			this.gameService.game.players[client.id].timerId = timerId;
		} else {
			console.log(`${client.id} disconnected`);
		}
		}

		afterInit(server: Server) {
				this.gameService.logger.log('Init');
		}

	@SubscribeMessage('reconnect')
		handleReconnect(client: Socket, reconnectedPlayer: any): void {
			console.log(`Player ${reconnectedPlayer.name} reconnected`);
			const oldSocketId = reconnectedPlayer.id;
			const existingPlayer = this.gameService.game.players[oldSocketId];
			if (existingPlayer) {
				clearTimeout(this.gameService.game.players[oldSocketId].timerId);
				 this.gameService.game.players[client.id] = {
					...existingPlayer,
					disconnected: undefined,
					id: client.id,
				};
				delete this.gameService.game.players[oldSocketId];
				this.gameService.rejoinRoom(client, oldSocketId, this.server);
				this.gameService.refreshPlayers(this.server);
				this.gameService.refreshRooms(this.server);
			}else {
				console.log(`Player ${reconnectedPlayer.name} not found`);
			}
		}

	@SubscribeMessage('login')
		handleLogin(client: Socket, payload: {name: any, userIdDataBase: any}): void {
			console.log('USERID-DB passado COMO PARAMETRO P/ LOGIN: ', payload.userIdDataBase, ' | Nome é: ', payload.name);
			this.gameService.game.players[client.id] = new PlayerModel({name: payload.name, id: client.id});
			this.gameService.game.players[client.id].userIdDataBase = payload.userIdDataBase;
			console.log('PLAYER CRIADO: ', this.gameService.game.players[client.id]);
			this.gameService.refreshPlayers(this.server);
			this.gameService.refreshRooms(this.server);
			this.gameService.logger.log('Game: ', JSON.stringify(this.gameService.game));
		}

	@SubscribeMessage('exitQueue')
		handleExitQueue(client: Socket): void {
			this.gameService.exitQueue(client, this.server);
		}

		@SubscribeMessage('addOnQueue')
				handleAddOnQueue(client: Socket): void {
					this.gameService.logger.log(`User no banco em addOnQueue: ${JSON.stringify(client.data.user)}`);	
					this.gameService.addOnQueue(client, this.server);
				}

		@SubscribeMessage('execMatch')
				handleExecMatch(client: Socket): void {
						this.gameService.executeMatch(client, this.server);
				}

	@SubscribeMessage('customizeAndPlay')
		handleCustomizeAndPlay(client: Socket, customChoices: any) : void {
			this.gameService.customizeAndPlay(client, customChoices, this.server);
		}

		@SubscribeMessage('createRoom')
				handleCreateRoom(client: Socket, roomId: string): void {
						this.gameService.createRoom(client, roomId, this.server);
						this.server.emit(
								'ReceiveMessage',
								`${this.gameService.game.players[client.id].name} criou uma sala.`,
							);
				}

		@SubscribeMessage('leaveRoom')
				handleLeaveRoom(client: Socket) : void {
			this.gameService.logger.log('Chamando LEAVEROOM')
						this.gameService.leaveRoomInit(client, this.server);
				}

		@SubscribeMessage('gameLoaded')
				handleGameLoaded(client: Socket): void {
						this.gameService.gameLoaded(client);
				}

		@SubscribeMessage('enterSpectator')
				handleEnterSpectator(client: Socket, roomId: string) : void {
						this.gameService.enterSpectator(client, roomId, this.server);

 		}

		@SubscribeMessage('sendKey')
				handleSendKey(client: Socket, payload: { type: string; key: string }): void {
						this.gameService.sendKey(client, payload);
				}

		@SubscribeMessage('sendMessage')
		sendMessage(client: Socket, payload: string): void {
			const player = this.gameService.game.players[client.id];
			console.log(payload);
			this.server.emit('ReceiveMessage', `${player.name}: ${payload}`);
		}

		@SubscribeMessage('msgToServer')
		HandleMessage(client: Socket, payload: string): void {
			this.server.emit('msgToClient', payload, client.id);
		}
};
