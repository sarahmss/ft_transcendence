import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ConnectedUserService {
  private connectedUser: Map<string, Socket> = new Map();

  addConnection(userId: string, client_socket: Socket) {
    this.connectedUser.set(userId, client_socket);
  }

  removeConnection(userId: string) {
    this.connectedUser.delete(userId);
  }

  getConnection(userId: string): Socket {
    return this.connectedUser.get(userId);
  }
}
