import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { FriendshipStatus } from "src/helpers/types.helper";

@Entity()
export class Friends {
	@PrimaryGeneratedColumn("uuid")
	friendsTableId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @Column({ nullable: false })
    status: FriendshipStatus;

    @Column({ nullable: false })
    friendId: string;
}