import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connections } from 'src/entity/connections.entity';
import { User } from 'src/entity/user.entity';
@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connections)
    private readonly ConnectionsRepository: Repository<Connections>,
  ) {}

  newConnection(client: string, user: User) {
    const Connections = { client, user };
    return this.ConnectionsRepository.save(Connections);
  }

  removeConnection(client: string) {
    return this.ConnectionsRepository.delete({ client });
  }

  clearConnections() {
    this.ConnectionsRepository.clear();
  }

  async hasConnections(user: User) {
    const userSession = await this.ConnectionsRepository.findOneBy({
      user: { userId: user.userId },
    });
    if (userSession) {
      return true;
    }
    return false;
  }
}
