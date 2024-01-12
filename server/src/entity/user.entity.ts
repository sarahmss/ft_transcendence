import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsAlphanumeric, IsEmail } from 'class-validator';
import { status } from "../helpers/types.helper";
import { UpdateUserDto } from "../users/dto/user.dto";
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
}
