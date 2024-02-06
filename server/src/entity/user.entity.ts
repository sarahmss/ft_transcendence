import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsAlphanumeric, IsEmail } from 'class-validator';
import { status } from "../helpers/types.helper";
import { UpdateUserDto } from "../users/dto/user.dto";
import { MatchHistory } from "./match.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	userId: string;

	@Column({unique: true, nullable: false, default: "Player"})
	userName: string;

	@Column({unique: true, nullable: true})
	email: string;

	@Column({nullable: true, default: 0})
	externalId: number;

	@Column({unique: false, nullable: true})
	password: string;

	@Column({unique: false, nullable: true})
	secret2Fa: string;

	@Column({ nullable: false, default: status.OFF})
	status: status;

	@Column("text", {nullable: true, default: "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"})
	profilePicture: string;

	@Column({ default: false, nullable: false})
	has2FaAuth: boolean;

	@Column({ nullable: false, default: 0 })
    gamesWonToLevelUp: number;

	@Column({ nullable: false, default: 0 })
    totalGamesWon: number;

    @Column({ nullable: false, default: 1 }) 
    level: number;

	@OneToMany(() => MatchHistory, matchHistory => matchHistory.winner)
    winningGames: MatchHistory[];

    @OneToMany(() => MatchHistory, matchHistory => matchHistory.loser)
    losingGames: MatchHistory[];
}

// TO DO:
// 1- A atualização das entities User a partir de uma atualização de MatchHistory não é automática
// é preciso codar isso TAMBEM!
// 2- O que eu fiz que atrapalhou a autenticação pela intra? Estava funcionando antes do MatchHistory...
// mas curioso que, com um login interno, não dá esse problema