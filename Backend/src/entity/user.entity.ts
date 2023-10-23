import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsAlphanumeric, IsEmail } from 'class-validator';
import { status } from "../helpers/types.helper";
import { UpdateUserDto } from "../users/dto/user.dto";
@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	userId: string;

	@IsAlphanumeric()
	@Column({unique: true, nullable: false, default: "Player"})
	userName: string;

	@IsEmail()
	@Column({unique: true, nullable: true, default: ""})
	email: string;

	@Column({nullable: false})
	externalId: number;

	@Column()
	password: string;

	@Column({ nullable: false, default: status.OFF})
	status: status;

	@Column("text", {nullable: true, default: "empty"})
	profilePicture: string;

	@Column({ default: false, nullable: false})
	hasTwoFactorAuth: boolean;
}
