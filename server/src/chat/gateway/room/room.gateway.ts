
import { OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer } from '@nestjs/websockets';

import { createMessage } from 'src/chat/dto/Message.dto';
import { MessageService } from 'src/chat/service/message/message.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor( private readonly messageService: MessageService ) {}

	@WebSocketServer() server: Server;

	users: number = 0;

	handleConnection(client: Socket, ...args: any[]) {
		this.users += 1;
		console.log(client);
	}

	handleDisconnect(client: Socket) {
		this.users -= 1;
	}

	// Payload is data sent by the client
	@SubscribeMessage('receive-message')
	handleMessage(client: Socket, payload: any) {
		/*
		this.messageService.createMessage(payload.message,
										 payload.room,
										 payload.user);
		*/
		console.log(payload);
		// this.server.to(payload.room).emit();
		this.server.emit("message-response", payload)
	}
}
