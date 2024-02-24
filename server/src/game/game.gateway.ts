import { Logger, Injectable, UnauthorizedException} from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { PlayerModel } from './game.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AppGateway } from 'src/app/app.gateway';
import { EmissionToChatService } from './emissionToChat/emissionToChat.service';

@WebSocketGateway ({
	namespace: '/game',
	cors: {
		origin: [process.env.FRONT_URL, 'http://api.intra.42.fr', process.env.BACK_URL],
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
					private readonly appGateway: AppGateway,
					private readonly chatEmitter: EmissionToChatService
					) {}

		async handleConnection(client: Socket) {
			// precisa identificar aqui
			const transport = client.conn.transport.name;
			console.log('Tipo de transport: ', transport);
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
		}

		async handleDisconnect(client: Socket) {
			if (this.gameService.game.players[client.id]) {
			console.log(`${this.gameService.game.players[client.id].name} disconnected`);
			this.gameService.game.players[client.id].disconnected = new Date().getTime();
			await this.gameService.removePlayer(client.id, client, this.server);
			// const timerId = setTimeout(() => {
			// 	this.gameService.removePlayer(client.id, client, this.server);

			// }, 5000);
			// this.gameService.game.players[client.id].timerId = timerId;
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

	@SubscribeMessage('loginHostPrivateMatch')
		handleLoginHostPrivateMatch(client: Socket, payload: {gameId: string, role: string, name: string, userIdDataBase: string}) {
			//criar tudo o que precisa num fluxo normal até o ponto da tela de Customize
			//usar o gameId (será a id da room nesse caso) para saber em que sala entrar
			this.gameService.game.players[client.id] = new PlayerModel({name: payload.name, id: client.id});
			this.gameService.game.players[client.id].userIdDataBase = payload.userIdDataBase;
			// this.gameService.refreshPlayers(this.server); // manter isso aqui? porque vai ter o joinRoom...
			this.gameService.joinRoom(client, payload.gameId, this.server);
			console.log('The HOST client [', client.id, '] entered in a vacant room');
			console.log('Private Room ID: ', payload.gameId);
		}

	@SubscribeMessage('loginGuestPrivateMatch')
		handleLoginGuestPrivateMatch(client: Socket, payload: {gameId: string, role: string, name: string, userIdDataBase: string}) {
			//criar tudo o que precisa num fluxo normal até o ponto da tela de Customize
			//usar o proprio id pra criar a sala e entrar e emitir a mensagem pro chat socket de quem convidou
			//lembrar que o Match só é criado a partir do momento que o outro jogador
			//se junta à sala (em joinRoom), entao a tela de Customize só será desbloqueada
			//quando o usuario que fez o convite se logar e entrar...
			this.gameService.game.players[client.id] = new PlayerModel({name: payload.name, id: client.id});
			this.gameService.game.players[client.id].userIdDataBase = payload.userIdDataBase;
			//this.gameService.refreshPlayers(this.server); //mantem isso aqui agora ou deixa pra depois?
			this.gameService.createRoom(client, client.id, this.server);
			// agora precisa só emitir a mensagem de 'ok, sala criada' para o chat-socket do user
			// que convidou e enviar juntamente o id da sala (que é o client.id)
			console.log('Id de quem criou a sala: ', client.id);
			this.chatEmitter.emitDataToChatSocket('game.invitation.send', [payload.gameId],  { requestorId: client.id, userName: payload.name }, 'redir-private-match');
		}

	@SubscribeMessage('login')
		handleLogin(client: Socket, payload: {name: any, userIdDataBase: any}): void {
			this.gameService.game.players[client.id] = new PlayerModel({name: payload.name, id: client.id});
			this.gameService.game.players[client.id].userIdDataBase = payload.userIdDataBase;
			this.gameService.refreshPlayers(this.server);
			// this.gameService.refreshRooms(this.server);
		}

	@SubscribeMessage('exitQueue')
		handleExitQueue(client: Socket): void {
			this.gameService.exitQueue(client, this.server);
		}

		@SubscribeMessage('addOnQueue')
				handleAddOnQueue(client: Socket): void {	
					this.gameService.addOnQueue(client, this.server);
				}

		@SubscribeMessage('execMatch')
				handleExecMatch(client: Socket): void {
						this.gameService.executeMatch(client, this.server);
				}

	@SubscribeMessage('customizeAndPlay')
		handleCustomizeAndPlay(client: Socket, customChoices: any) : void {
			this.gameService.customizeAndPlay(client, customChoices, this.server);
			this.appGateway.setStatusPlaying(client.data.user);
		}

	@SubscribeMessage('createRoom')
		handleCreateRoom(client: Socket, roomId: string): void {
			this.gameService.createRoom(client, roomId, this.server);
			this.server.emit('ReceiveMessage', `${this.gameService.game.players[client.id].name} criou uma sala.`);
		}

	@SubscribeMessage('leaveRoom')
		handleLeaveRoom(client: Socket) : void {
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
		handleMessage(client: Socket, payload: string): void {
			this.server.emit('msgToClient', payload, client.id);
		}
};
