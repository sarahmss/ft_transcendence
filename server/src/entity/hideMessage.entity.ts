
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class HideMessage {
  
  @PrimaryGeneratedColumn('uuid', {name: 'view_id'})
  view_id: string;

	@Column({name: 'message_id'})
	messageId: string;

	@Column({name: 'target_id'})
	targetId: string;

  @Column({name: "room_id"})
  roomId: string;

  @ManyToOne(() => Message, (entity: Message) => entity.messageId, {onDelete: "CASCADE"} )
  @JoinColumn({name: 'message_id'})
  message: Message;

  @ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: "CASCADE"})
  @JoinColumn({name: "target_id"})
  target: User;

  @ManyToOne(() => Room, (entity: Room) => entity.roomId, {onDelete: "CASCADE"})
  @JoinColumn({name: "room_id"})
  room: Room;
}
