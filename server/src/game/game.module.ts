import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MatchHistory } from '../entity/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([MatchHistory])],
    providers: [GameGateway, GameService],
    controllers: [],
})

export class GameModule {}
