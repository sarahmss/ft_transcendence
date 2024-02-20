import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UsersService } from '../users/users.service';
import { MatchHistory } from '../entity/match.entity';

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
	userIdDataBase: any;
	state: string;
	customizations: any
	disconnected : any;
	timerId : any;

	constructor(data: {name: string, id: string, room?: string}) {
		this.name = data.name;
		this.id = data.id;
		this.room = data.room || '';
		this.userIdDataBase = '';
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
	player1Name: string;
	player2Name: string | undefined;
	spectators: Record<string, any>;

	constructor(name: string, player1: string, player2: string | undefined, player1Name: string, player2Name: string | undefined){
		this.name = name;
		this.player1 = player1;
		this.player2 = player2;
		this.player1Name = player1Name;
		this.player2Name = player2Name;
		this.spectators = {};
	}
}

class MatchModel {
	score1: number;
	score2: number;
	player1SocketID: string;
	player2SocketID: string;
	gameConfig: any;
	player1: any;
	player2: any;
	status: string;
	timeStartMatch: any;
	ball: any;
	message: string;
	accelerated: boolean;

	constructor(gameConfig: any, player1SocketID: string, player2SocketID: string) {
		this.score1 = 0;
		this.score2 = 0;
		this.gameConfig = gameConfig;
		this.player1 = { ready: false, x: 10, y: this.gameConfig.height / 2, height: 80, width: 10, speed: 5};
		this.player2 = { ready: false, x: this.gameConfig.width - 10, y: this.gameConfig.height / 2, height: 80, width: 10, speed: 5 };
		this.player1SocketID = player1SocketID;
		this.player2SocketID = player2SocketID;
		this.status = 'CUSTOM';
		this.timeStartMatch = '';
		this.ball = '';
		this.message = '';
		this.accelerated = false;
	}
}

@Injectable()
export class GameService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly usersService: UsersService,
		@InjectRepository(MatchHistory)
		private readonly matchRepository: Repository<MatchHistory>,
		) {}

    public logger: Logger = new Logger('AppGateway');
    public gameConfig = {
        width: 640,
        height: 420,
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
		this.game.rooms[client.id] = new RoomModel(`Room of ${this.game.players[client.id].name}`, client.id, undefined, this.game.players[client.id].name, undefined);
        this.game.players[client.id].room = client.id;
		this.game.players[client.id].state = 'in_room';
        this.refreshPlayers(server);
		this.refreshWaitingQueue(server, Object.keys(this.game.waiting).length);
        this.refreshRooms(server);
        this.refreshMatch(server, roomId);
    }

	rejoinRoom(client: Socket, oldClientId: string, server: Server): void {
		const currentCliendId = client.id;
		const player = this.game.players[currentCliendId];
		if (!player || !player.room) {
			return;
		}

		const roomId = player.room;
		const room = this.game.rooms[roomId];
		const match = this.game.match[roomId];
		if (match.player1SocketID === oldClientId)
			match.player1SocketID = currentCliendId;
		else if (match.player2SocketID === oldClientId)
			match.player2SocketID = oldClientId;
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
			if (room.player1 === oldClientId) {
				room.player1 = currentCliendId;
				room.player1Name = player.name;
			} else if (room.player2 === oldClientId) {
				room.player2 = currentCliendId;
				room.player2Name = player.name;
			} else
				return;
		}

		client.join(roomId);
		console.log(`${player.name} rejoined room`);
		this.refreshMatch(server, roomId);
	}

    joinRoom(client: Socket, roomId: string, server : Server) {

        client.join(roomId);
        const position = this.game.rooms[roomId].player1 ? '2' : '1';
        this.game.rooms[roomId][`player${position}`] = client.id;
		this.game.rooms[roomId][`player${position}Name`] = this.game.players[client.id].name;
        this.game.players[client.id].room = roomId;
		this.game.players[client.id].state = 'in_room';
        const room = this.game.rooms[roomId];
        if (room.player1 && room.player2) {
			this.game.match[roomId] = new MatchModel(this.gameConfig, room.player1, room.player2);
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
        if (match.player1.ready && match.player2.ready) {
            match.status = 'PLAY';
			match.timeStartMatch = new Date();
            match.ball = {
                width: 10,
                xdirection: 1,
                ydirection: 1,
                xspeed: 4.0,
                yspeed: 4.0,
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
				console.log('This client [', client.id, '] is already in the room.');
				return;
			} else {
				if(!this.game.rooms[key].player1 || !this.game.rooms[key].player2)
				{
					delete this.game.waiting[client.id];
					this.refreshWaitingQueue(server, Object.keys(this.game.waiting).length);
					this.joinRoom(client, key, server);
					console.log('The client [', client.id, '] entered in a vacant room');
					console.log('Room ID: ', key);
					return;
				}
			}
		  });

		if (this.game.players[client.id].state !== 'in_room' && this.game.players[client.id].state !== 'in_game') {
			this.createRoom(client, client.id, server);
			console.log('The client [', client.id, '] created a room of ID: ', client.id);
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

	matchesToLevelUp(currentLevel: number): number {
		if(currentLevel < 5) {
			return 5;
		} else {

			const baseGame = 5;
			const increment = 2;
			return baseGame + increment * Math.floor((currentLevel - 5) / 3);
		}
	}

	async storeMatchHistory(match: MatchModel, roomId: string) {
		const user1 = await this.usersRepository.findOne({ where: { userId: this.game.players[match.player1SocketID].userIdDataBase }, relations: ['losingGames', 'winningGames'] });
		const user2 = await this.usersRepository.findOne({ where: { userId: this.game.players[match.player2SocketID].userIdDataBase }, relations: ['losingGames', 'winningGames'] });

		console.log('User1: ', user1);
		console.log('User2: ', user2);
		if (user1 && user2) {
			const matchHist = new MatchHistory();
			const timeEndMatch = new Date();
			const durationInSeconds = Math.floor((timeEndMatch.getTime() - match.timeStartMatch.getTime()) / 1000);
			matchHist.gameTime = durationInSeconds;
			if (match.score1 > match.score2) {
				matchHist.winner = user1;
				matchHist.loser = user2;
				matchHist.loserScore = match.score2;
				matchHist.winnerScore = match.score1;
				user1.winningGames.push(matchHist);
				user2.losingGames.push(matchHist);
			}
			else if (match.score2 > match.score1) {
				matchHist.winner = user2;
				matchHist.loser = user1;
				matchHist.loserScore = match.score1;
				matchHist.winnerScore = match.score2;
				user2.winningGames.push(matchHist);
				user1.losingGames.push(matchHist);
			}
			await this.usersRepository.save(user1);
			await this.usersRepository.save(user2);
			delete this.game.match[roomId];
		}
		else
			console.log('User1 e User2 ainda não chegaram....');
	}

	isCurrentUserTheWinner(match: MatchModel, playerNumbers: string): boolean {
		if ((playerNumbers === 'player1' && match.score1 > match.score2)
			|| (playerNumbers === 'player2' && match.score2 > match.score1))
			return true;
		else
			return false;
	}

	async updateWinnerScoresInDB(client: Socket, match: MatchModel, playerNumbers: string) {
		const player = this.game.players[client.id];
		const user = await this.usersService.findById(player.userIdDataBase);
		
		if (user) {
			if (this.isCurrentUserTheWinner(match, playerNumbers)) {
				user.gamesWonToLevelUp += 1;
				user.totalGamesWon += 1;
				const gamesWonToLevelUp = user.gamesWonToLevelUp;
				if (gamesWonToLevelUp >= this.matchesToLevelUp(user.level)) {
					user.level += 1;
					user.gamesWonToLevelUp = 0;
				}
			}
			else {
				console.log('This user IS NOT the winner: ', user.userName);
				user.totalGamesLost += 1;
			}
			await this.usersRepository.save(user);
			console.log('[UpdateWinnerScore] | WINNER SUCCESSFULLY SAVED IN DB AFTER MATCH');
		}
		else {
			console.log('[UpdateWinnerScore] | WE COULD NOT FIND USER IN DB');
		}
	}

	async leaveRoomInit(client: Socket, server: Server) {
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
					if (match.status !== 'END') {
						match.status = 'END';
						match.message = `Player ${
						  this.game.players[client.id].name
						} left the match.`;
					}
					else {
						await this.updateWinnerScoresInDB(client, match, playerNumbers);
					}
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
				if (match) {
					await this.storeMatchHistory(match, roomId);
                }
				delete this.game.rooms[roomId];
            }
            client.leave(roomId);
            this.refreshMatch(server, roomId);
        }
		this.logger.log('User left the match: ', JSON.stringify(this.game.players[client.id]));
        this.refreshPlayers(server);
        this.refreshRooms(server);
    }

	async removePlayer(playerId: string, client: Socket, server: Server) {
		await this.leaveRoomInit(client, server);
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
                this.checkCollision(match, roomId);
            break;
        }
        this.refreshMatch(server, roomId);
        setTimeout(() => this.gameInProgress(roomId, server), 1000 / 30);
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

    restartMatch(match, roomId) {
      const { ball, gameConfig } = match;

      ball.xdirection *= -1;
      ball.x = gameConfig.width / 2;
      ball.y = gameConfig.height / 2;

	  if (match.score1 === 5 || match.score2 === 5) {
		const playerNumber = match.score1 === 5 ? 1 : 2;
		const playerSocketId = this.game.rooms[roomId][`player${playerNumber}`];
		match.status = 'END';
		match.message = `The player ${this.game.players[playerSocketId].name} won.`;
	  }
    }

    checkCollision(match, roomId) {
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
            this.restartMatch(match, roomId);

        } else if (ball.x > gameConfig.width - ball.width) {
            match.score1++;
            this.restartMatch(match, roomId);
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
