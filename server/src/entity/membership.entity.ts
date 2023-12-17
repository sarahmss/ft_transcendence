import { Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn} from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
export class Membership {

	@PrimaryColumn()
	roomId: string;

	@PrimaryColumn({})
	userId: string;

	@ManyToOne(() => Room,
			   (entity: Room) => entity.roomId )
	@JoinColumn({ name: 'room_id' })
	room: Room;

	@ManyToOne(() => User,
			   (entity: User) => entity.userId)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ default: false })
	owner: boolean;

	@Column({ default: false })
	admin: boolean;

	@CreateDateColumn({ name: 'join_date',
					  type: 'timestamptz' })
	joinDate: Date;
}
