import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [GameService, GameGateway],
    controllers: [],
})

export class GameModule {}
