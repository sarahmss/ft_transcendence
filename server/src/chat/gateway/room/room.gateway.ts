
import { OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer } from '@nestjs/websockets';

import { createMessage } from 'src/chat/dto/Message.dto';
import { MessageService } from 'src/chat/service/message/message.service';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor( private readonly messageService: MessageService ) {}

	@WebSocketServer() server: any;
	users: number = 0;

	handleConnection(client: any, ...args: any[]) {
		this.users += 1;

	}

	handleDisconnect(client: any) {
		this.users -= 1;
	}

	@SubscribeMessage('receive-message')
	handleMessage(client: any, payload: createMessage): string {
		this.messageService.createMessage(payload.message,
										 payload.room,
										 payload.user);
		return 'Wow creation done!';
	}
}
