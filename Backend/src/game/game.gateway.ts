
import { Logger, Injectable,  } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Player } from './player.model';
import { Server, Socket } from 'socket.io';

@WebSocketGateway ({
    cors: {
      origin: '*',
    },
})

@Injectable ()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor( private readonly gameService: GameService) {}

    handleConnection(client: Socket) {

        this.gameService.logger.log(`Client connected: ${client.id}`);
        const name = 'Player_' + client.id.substring(0, 5);
        const player = new Player(name);
        this.gameService.game.players[client.id] = { name };
        this.gameService.refreshPlayers(this.server);
        this.gameService.refreshRooms(this.server);
        this.gameService.logger.log('Game: ', this.gameService.game);
    }
    
    handleDisconnect(client: Socket) {

        this.gameService.logger.log(`Client disconnected: ${client.id}`);
        this.server.emit(`${this.gameService.game.players[client.id]} saiu`);
        this.gameService.leaveRoomInit(client, this.server);
        delete this.gameService.game.players[client.id];
        this.gameService.refreshPlayers(this.server);
        this.gameService.refreshRooms(this.server);
    }

    afterInit(server: Server) {

        this.gameService.logger.log('Init');
    }

    @SubscribeMessage('joinRoom')
        handleJoinRoom(client: Socket, roomId: string): void {
            const room = this.gameService.joinRoom(client, roomId, this.server);
            this.server.emit(
                'ReceiveMessage',
                `${this.gameService.game.players[client.id].name} entered a room.`,
              );
        }

    @SubscribeMessage('createRoom')
        handleCreateRoom(client: Socket, roomId: string): void {
            this.gameService.createRoom(client, roomId, this.server);
            this.server.emit(
                'ReceiveMessage',
                `${this.gameService.game.players[client.id].name} created a room.`,
              );       
        }
    @SubscribeMessage('leaveRoom')
        handleLeaveRoom(client: Socket) : void {
            this.gameService.leaveRoomInit(client, this.server);
        }

    @SubscribeMessage('gameLoaded')
        handleGameLoaded(client: Socket): void {
            this.gameService.gameLoaded(client);
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
