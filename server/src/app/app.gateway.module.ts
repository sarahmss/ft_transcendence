import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AppGateway } from './app.gateway';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [AuthModule, UsersModule, ConnectionsModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class AppGatewayModule {}
