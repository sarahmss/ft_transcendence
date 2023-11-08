import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [AuthModule, UsersModule,],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class AppGatewayModule {}
