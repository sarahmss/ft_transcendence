import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([User])],
    providers: [GameGateway, GameService],
    controllers: [],
})

export class GameModule {}
