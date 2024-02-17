import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionsService } from './connections.service';
import { Connections } from 'src/entity/connections.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Connections])],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
