
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn} from 'typeorm';

import { User } from './user.entity';
import { Room } from './room.entity';
import { LOCAL_BLOCK } from 'src/constants/blackListType.constant';

@Entity()
export class BlackList {

	@PrimaryGeneratedColumn('uuid', {name: 'black_list_id'})
	blackListId: string;

	@Column({name: 'blocker'})
	blockerId: string;

	@Column({name: 'blocked_user'})
	blockedId: string;

	@Column({name: 'room_id'})
	roomId: string;

	@ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: "CASCADE"})
	@JoinColumn({name: 'blocker'})
	blocker: User;

	@ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: "CASCADE"})
	@JoinColumn({name: 'blocked_user'})
	blocked_user: User;

	@ManyToOne(() => Room, (entity: Room) => entity.roomId, {onDelete: "CASCADE"})
	@JoinColumn({name: 'room_id'})
	room: Room;

	@Column({ default: true })
	status: boolean;

	@Column({default: LOCAL_BLOCK, name: 'block_type'})
	blockType: number;

	@CreateDateColumn({ type: 'timestamptz' })
	start_end: Date;

	@Column({ type: 'timestamptz',
			nullable: true,
			default: new Date(Date.now() + 600000) })
	block_end: Date;
}
