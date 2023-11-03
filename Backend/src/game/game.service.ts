import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService {

    public logger: Logger = new Logger('AppGateway');
    public gameConfig = {
        
        width: 580,
        height: 320,
    };

    public game = {

        players: {},
        rooms: {},
        match: {},
    };

    createRoom(client: Socket, roomId: string, server : Server): void {

        client.join(client.id);
        this.game.rooms[client.id] = {
            name: `Room of ${this.game.players[client.id].name}`,
            player1: client.id,
            player2: undefined,
        };
        this.game.players[client.id].room = client.id;
        this.refreshPlayers(server);
        this.refreshRooms(server);
        this.refreshMatch(server, roomId);
        console.log(this.game.players[client.id].name, 'created a room.');
    }

    /*
    
    findMatch()
    
    */ 

    joinRoom(client: Socket, roomId: string, server : Server) {

        client.join(roomId);
        const position = this.game.rooms[roomId].player1 ? '2' : '1';
        this.game.rooms[roomId][`player${position}`] = client.id;
        this.game.players[client.id].room = roomId;
        const room = this.game.rooms[roomId];
        if (room.player1 && room.player2) {

          this.game.match[roomId] = {
            score1: 0,
            score2: 0,
            gameConfig: this.gameConfig,
            player1: {
              ready: false,
              x: 5,
              y: this.gameConfig.height / 2 - 40,
              height: 80,
              width: 10,
              speed: 5
            },
            player2: {
              ready: false,
              x: this.gameConfig.width - 15,
              y: this.gameConfig.height / 2 - 40,
              height: 80,
              width: 10,
              speed: 5
            },
            status: 'START',
          };
          this.gameInProgress(roomId, server);
        }
        this.refreshPlayers(server);
        this.refreshRooms(server);
        this.refreshMatch(server, roomId);
        console.log(this.game.players[client.id].name, 'entered a room.');
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
            match.ball = {
                width: 5,
                xdirection: 1,
                ydirection: 1,
                xspeed: 2.8,
                yspeed: 2.2,
                x: this.gameConfig.width / 2,
                y: this.gameConfig.height / 2,
            };
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
            this.game.players[client.id].room = undefined;
            const playerNumbers = 'player' + (client.id === room.player1 ? 1 : 2);
            room[playerNumbers] = undefined;
            if (match) {
                match[playerNumbers] = undefined;
                match.status = 'END';
                match.message = `The player $ {
                  this.game.players[client.id].name
                } , disconnected.`;
            }
            if (!room.player1 && !room.player2) {
                delete this.game.rooms[roomId];
                if (match) {
                  delete this.game.match[roomId];
                }
            }
            this.refreshMatch(server, roomId);
            client.leave(roomId);
        }
        this.refreshPlayers(server);
        this.refreshRooms(server);
    }

    gameInProgress(roomId: string, server: Server): void {

        const match = this.game.match[roomId];
        if (!match || match.status === 'END') {
            return;
        }

        const { ball } = match;
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
                player.y -= player.speed;
                break;
            case 'DOWN':
                player.y += player.speed;
            break;
        }

        if (player.y < 0) {
            player.y = 0;
        } else if (player.y + player.height > match.gameConfig.height) {
          player.y = match.gameConfig.height - player.height;
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
        if (by < ry) {
            testY = ry;
        }
        else if (by > ry + rh) {
            testY = ry + rh;
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
    }

    refreshPlayers = (server: Server) => {
        server.emit('PlayersRefresh', this.game.players);
    }

    refreshRooms = (server: Server) => {
        server.emit('RoomsRefresh', this.game.rooms);
    }
 
    refreshMatch = (server: Server, roomId) => {
        server.to(roomId).emit('MatchRefresh', this.game.match[roomId] || {});
    }
};