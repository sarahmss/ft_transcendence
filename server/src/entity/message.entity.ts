
import { Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class Message {
	
	@PrimaryGeneratedColumn("uuid", {name: 'message_id'})
	messageId: string;

	@ManyToOne(() => Room, (entity: Room) => entity.roomId)
	@JoinColumn({ name: 'room_id' })
	roomId: Room;

	@Column()
	message: string;

	@OneToMany(() => User, (entity: User) => entity.userId)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@UpdateDateColumn({ type: 'timestamptz' })
	timestamp: Date;
}
