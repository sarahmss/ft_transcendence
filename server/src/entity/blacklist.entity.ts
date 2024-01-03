
import { Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';


@Entity()
export class BlackList {

	@PrimaryGeneratedColumn('uuid', {name: 'black_list_id'})
	blackListId: string;

	@ManyToOne(() => User, (entity: User) => entity.userId)
	@JoinColumn({name: 'blocker'})
	blocker: User;

	@ManyToOne(() => User, (entity: User) => entity.userId)
	@JoinColumn({name: 'blocked_user'})
	blocked_user: User;

	@ManyToOne(() => Room, (entity: Room) => entity.roomId)
	@JoinColumn({name: 'room_id'})
	roomId: Room

	@Column({ default: true })
	status: boolean;

	@CreateDateColumn({ type: 'timestamptz' })
	start_end: Date;

	@Column({ type: 'timestamptz',
			nullable: true,
			default: null })
	block_end: Date;
}
