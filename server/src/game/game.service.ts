import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from 'socket.io';

class GameModel {
	players: Record<string, PlayerModel>;
	rooms: Record<string, RoomModel>;
	match: Record<string, MatchModel>;
	waiting: Record<string, PlayerModel>;

	constructor() {
		this.players = {};
		this.rooms = {};
		this.match = {};
		this.waiting = {};
	}
}

export class PlayerModel {
	name: string;
	room: string;
	id: string;
	state: string;
	customizations: any
	disconnected : any;
	timerId : any;

	constructor(data: {name: string, id: string, room?: string}) {
		this.name = data.name;
		this.id = data.id;
		this.room = data.room || '';
		this.state = '';
		this.disconnected = undefined;
		this.timerId = undefined;
		this.customizations = {};
	}
}

class RoomModel {
	name: string;
	player1: string;
	player2: string | undefined;
	spectators: Record<string, any>;

	constructor(name: string, player1: string, player2: string | undefined){
		this.name = name;
		this.player1 = player1;
		this.player2 = player2;
		this.spectators = {};
	}
}

class MatchModel {
	score1: number;
	score2: number;
	gameConfig: any;
	player1: any;
	player2: any;
	status: string;
	ball: any;
	message: string;
	accelerated: boolean;

	constructor(gameConfig: any) {
		this.score1 = 0;
		this.score2 = 0;
		this.gameConfig = gameConfig;
		this.player1 = { ready: false, x: 10, y: this.gameConfig.height / 2, height: 80, width: 10, speed: 5};
		this.player2 = { ready: false, x: this.gameConfig.width - 10, y: this.gameConfig.height / 2, height: 80, width: 10, speed: 5 };
		this.status = 'CUSTOM';
		this.ball = '';
		this.message = '';
		this.accelerated = false;
	}
}

@Injectable()
export class GameService {

    public logger: Logger = new Logger('AppGateway');
    public gameConfig = {
        width: 580,
        height: 320,
    };

	public game: GameModel = new GameModel();

	customizeAndPlay(client: Socket, customChoices: any, server : Server): void {
		const roomId = this.game.players[client.id].room;
		this.game.players[client.id].state = 'in_game';

		this.game.players[client.id].customizations = customChoices;
		this.logger.log(JSON.stringify(this.game.rooms[roomId]));

		if(this.game.rooms[roomId].player1 && this.game.rooms[roomId].player2) {
			if (this.game.players[this.game.rooms[roomId].player1].state === 'in_game' && this.game.players[this.game.rooms[roomId].player2].state === 'in_game') {
				this.game.match[roomId].status = 'START';
				if (this.game.players[this.game.rooms[roomId].player1].customizations.speedMode === 'yes' && this.game.players[this.game.rooms[roomId].player2].customizations.speedMode === 'yes')
					this.game.match[roomId].accelerated = true;
			}
		}
		this.refreshPlayers(server);
		this.refreshMatch(server, client.id);
	}

    createRoom(client: Socket, roomId: string, server : Server): void {

        client.join(client.id);
		delete this.game.waiting[client.id];
		this.game.rooms[client.id] = new RoomModel(`Room of ${this.game.players[client.id].name}`, client.id, undefined);
        this.game.players[client.id].room = client.id;
		this.game.players[client.id].state = 'in_room';
        this.refreshPlayers(server);
		this.refreshWaitingQueue(server, Object.keys(this.game.waiting).length);
        this.refreshRooms(server);
        this.refreshMatch(server, roomId);
    }

	rejoinRoom(client: Socket, oldClientId: string): void {
		const currentCliendId = client.id;
		const player = this.game.players[currentCliendId];

		if (!player || !player.room) {
			return;
		}

		const roomId = player.room;
		const room = this.game.rooms[roomId];

		if (player.state === 'watching')
		{
			if (room)
			{
				room.spectators[client.id] = {
					id:currentCliendId,
					state:'watching'
				}
				delete room.spectators[oldClientId];
			}
			else
				return ;
		}
		else
		{
			if (room.player1 === oldClientId)
				room.player1 = currentCliendId;
			else if (room.player2 === oldClientId)
				room.player2 = currentCliendId;
			else
				return;

		}

		client.join(roomId);
		console.log(`${player.name} rejoined room`);
	}

    joinRoom(client: Socket, roomId: string, server : Server) {

        client.join(roomId);
        const position = this.game.rooms[roomId].player1 ? '2' : '1';
        this.game.rooms[roomId][`player${position}`] = client.id;
        this.game.players[client.id].room = roomId;
		this.game.players[client.id].state = 'in_room';
        const room = this.game.rooms[roomId];
        if (room.player1 && room.player2) {
			this.game.match[roomId] = new MatchModel(this.gameConfig);
          this.gameInProgress(roomId, server);
        }
        this.refreshPlayers(server);
        this.refreshRooms(server);
        this.refreshMatch(server, roomId);
    }

    enterSpectator(client: Socket, roomId: string, server: Server) : void {

        client.join(roomId);
        const spectator = client.id;
        if (!this.game.rooms[roomId].spectators)
        this.game.rooms[roomId].spectators = {};

        this.game.rooms[roomId].spectators[client.id] = {
            id:spectator,
            state:'watching'
        }
        this.game.players[client.id].state = 'watching';
        this.game.players[client.id].room = roomId;

        this.refreshPlayers(server);
        this.refreshMatch(server, roomId);
        this.refreshRooms(server);

    }

    gameLoaded(client: Socket): void {

        const roomId = this.game.players[client.id].room;
        const match = this.game.match[roomId];
        const player = 'player' + (this.game.rooms[roomId].player1 == client.id ? 1 : 2);
        match[player] = {
            ...match[player],
            ready: true
        };
        if (match.player1.ready && match.player2.ready) {''
            match.status = 'PLAY';
            match.ball = {
                width: 10,
                xdirection: 1,
                ydirection: 1,
                xspeed: 2.8,
                yspeed: 2.2,
                x: this.gameConfig.width / 2,
                y: this.gameConfig.height / 2,
            };
        }
    }

	exitQueue(client: Socket, server: Server): void {
		const player = this.game.players[client.id];
		player.state = '';
		if (player.room)
		{
			const room = this.game.rooms[player.room];
			const playerNumbers = 'player' + (client.id === room.player1 ? 1 : 2);
			room[playerNumbers] = undefined;
			if (!room.player1 && room.player2)
			delete this.game.rooms[player.room];
			client.leave;
			player.room = '';
			this.refreshRooms(server);
		}
		delete this.game.waiting[client.id];
		const tamanhoDoObjeto: number = Object.keys(this.game.waiting).length;
        this.refreshPlayers(server);
		this.refreshWaitingQueue(server, tamanhoDoObjeto);
	}

    addOnQueue(client: Socket, server: Server): void {

        const player = this.game.players[client.id];
        player.state = 'waiting';
        this.game.waiting[client.id] = player;
		const tamanhoDoObjeto: number = Object.keys(this.game.waiting).length;
        this.refreshPlayers(server);
		this.refreshWaitingQueue(server, tamanhoDoObjeto);
    }

	executeMatch(client: Socket, server: Server): void {

		Object.keys(this.game.rooms).forEach((key) => {
			if( this.game.rooms[key].player1 == client.id || this.game.rooms[key].player2 == client.id){
				console.log('este client [', client.id, '] ja esta presente na sala');
				return;
			} else {
				if(!this.game.rooms[key].player1 || !this.game.rooms[key].player2)
				{
					delete this.game.waiting[client.id];
					this.refreshWaitingQueue(server, Object.keys(this.game.waiting).length);
					this.joinRoom(client, key, server);
					console.log('este client [', client.id, '] entrou numa sala com vaga');
					console.log('Sala de ID: ', key);
					return;
				}
			}
		  });

		if (this.game.players[client.id].state !== 'in_room' && this.game.players[client.id].state !== 'in_game') {
			this.createRoom(client, client.id, server);
			console.log('este client [', client.id, '] criou uma sala de ID: ', client.id);
		}
	}

	sendKey(client: Socket, payload: {type: string, key: string}): void {
		const { type, key } = payload;
		const player= this.game.players[client.id];
		const roomId = this.game.players[client.id].room;
		const room = this.game.rooms[roomId];
		const clientId = client.id;
		const playerNumbers = 'player' + (client.id === room.player1 ? 1 : 2);
		const match = this.game.match[roomId];
		const direction = type === 'keyup' ? 'STOP' : key.replace('Arrow', '').toUpperCase();
		match[playerNumbers] = { ...match[playerNumbers], direction };
	}

	leaveRoomInit(client: Socket, server: Server): void {

		const clientId = client.id;
		const roomId = this.game.players[client.id].room;
		const room = this.game.rooms[roomId];

		if (room) {
			const match = this.game.match[roomId];
			if (this.game.players[client.id].state !== 'watching')
			{
				const playerNumbers = 'player' + (client.id === room.player1 ? 1 : 2);
				room[playerNumbers] = undefined;
				if (match) {
					match[playerNumbers] = undefined;
					match.status = 'END';
					match.message = `Player ${
					  this.game.players[client.id].name
					} left the match.`;
				}
            }
			else
			{
				delete room.spectators[client.id];
				server.to(client.id).emit('RemoveMatch');
			}
			this.game.players[client.id].room = '';
			this.game.players[client.id].state = '';

			if (!room.player1 && !room.player2 && Object.keys(room.spectators).length === 0) {
                delete this.game.rooms[roomId];
                if (match) {
					// é aqui que precisa gravar as informações da
					// partida antes de fazer o delete

					delete this.game.match[roomId];
                }
            }
            this.refreshMatch(server, roomId);
            client.leave(roomId);
        }
		this.logger.log('Usuário saiu da partida: ', JSON.stringify(this.game.players[client.id]));
        this.refreshPlayers(server);
        this.refreshRooms(server);
    }

	removePlayer(playerId: string, client: Socket, server: Server):void {
		console.log(`${this.game.players[playerId]} disconnected`);

		this.leaveRoomInit(client, server);
		delete this.game.players[client.id];
		this.refreshPlayers(server);
		this.refreshRooms(server);

	}

    gameInProgress(roomId: string, server: Server): void {

        const match = this.game.match[roomId];
        if (!match || match.status === 'END') {
            return;
        }
        switch (match.status) {
            case 'PLAY':
                this.moveBall(match);
                this.movePaddle(match);
                this.checkCollision(match);
            break;
        }
        this.refreshMatch(server, roomId);
        setTimeout(() => this.gameInProgress(roomId, server), 1000 / 60);
    }

    moveBall({ball}) {

        const xpos = ball.x + ball.xspeed * ball.xdirection;
        const ypos = ball.y + ball.yspeed * ball.ydirection;
        ball.x = xpos;
        ball.y = ypos;
    }

    movePaddle(match) {

        [1, 2].forEach((i) => {
        const player = match[`player${i}`];
        switch (player.direction) {
            case 'UP':
				if (player.y < ((player.height / 2) + 10))
				{
					player.y = (player.height / 2) + 10;
				}
				else
                	player.y -= player.speed;
                break;
            case 'DOWN':
				if ((player.y + player.height + 10) > match.gameConfig.height)
					player.y = match.gameConfig.height - ((player.height / 2) + 10);
				else
                	player.y += player.speed;
            break;
        }
        });
    }

    restartMatch(match) {

      const { ball, gameConfig } = match;

      ball.xdirection *= -1;
      ball.x = gameConfig.width / 2;
      ball.y = gameConfig.height / 2;
    }

    checkCollision(match) {

        const { ball, gameConfig } = match;
        if (ball.y > gameConfig.height - ball.width || ball.y < ball.width) {
            ball.ydirection *= -1;
        }
        const { x: bx, y: by, width: br } = ball;
        const playerNumber = bx < gameConfig.width / 2 ? 1 : 2;
        const player = `player${playerNumber}`;
        const { x: rx, y: ry, width: rw, height: rh } = match[player];
        let testX = bx;
        let testY = by;
        if (bx < rx) {
            testX = rx;
        }
        else if (bx > rx + rw) {
            testX = rx + rw;
        }
        if (by < ry - (rh/2)) {
            testY = ry;
        }
        else if (by > ry + (rh / 2)) {
            testY = ry + (rh / 2);
        }
        const distX = bx - testX;
        const distY = by - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));
        if (distance <= br) {
            ball.xdirection *= -1;
            ball.x = playerNumber === 1 ? match[player].x + match[player].width + br : match[player].x - br;
        } else if (ball.x < ball.width) {
            match.score2++;
            this.restartMatch(match);

        } else if (ball.x > gameConfig.width - ball.width) {
            match.score1++;
            this.restartMatch(match);
        }
		if (match.accelerated && Math.abs(match.score2 - match.score1) === 10)
		{
			match.ball.xspeed += 0.1;
			match.ball.yspeed += 0.1;
		}
    }

    refreshPlayers = (server: Server) => {
        server.emit('PlayersRefresh', this.game.players);
    }

    refreshRooms = (server: Server) => {
        server.emit('RoomsRefresh', this.game.rooms);
    }

    refreshMatch = (server: Server, roomId) => {
        if (roomId == undefined)
        {
            server.to(roomId).emit('MatchRefresh', {});
        }
        server.to(roomId).emit('MatchRefresh', this.game.match[roomId] || {});
    }

	refreshWaitingQueue = (server: Server, waitingLength) => {
		server.emit('WaitingRefresh', waitingLength);
	}
};
