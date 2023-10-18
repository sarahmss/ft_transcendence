import { Entity, PrimaryGeneratedColumn, Column,  } from "typeorm";
import { IsAlphanumeric, IsEmail } from 'class-validator';

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

    @Column()
    password: string;

    @Column("text", {nullable: true, default: "empty"})
    profilePicture: string;
}
