import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MatchHistory } from '../entity/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGatewayModule } from 'src/app/app.gateway.module';
import { GameController } from './game.controller';

@Module({
    imports: [AuthModule, UsersModule, AppGatewayModule, TypeOrmModule.forFeature([MatchHistory])],
    providers: [GameGateway, GameService],
    controllers: [GameController],
})

export class GameModule {}
