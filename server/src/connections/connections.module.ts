import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUser } from 'src/entity';
import { ConnectionsService } from './connections.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUser])],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectedUsersModule {}
