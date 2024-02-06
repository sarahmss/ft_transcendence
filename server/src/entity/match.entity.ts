import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class MatchHistory {

    @PrimaryGeneratedColumn("uuid")
    gameId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "winnerId" })
    winner: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "loserId" })
    loser: User;

    @Column({ nullable: false })
    winnerScore: number;

    @Column({ nullable: false })
    loserScore: number;

    @Column({ nullable: false })
    gameTime: number;
}