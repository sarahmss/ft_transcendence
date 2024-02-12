import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Friends {
	@PrimaryGeneratedColumn("uuid")
	friendsTableId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: false })
    friendId: string;
}