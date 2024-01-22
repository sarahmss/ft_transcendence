
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class ViewStatus {
  
  @PrimaryGeneratedColumn('uuid', {name: 'view_id'})
  view_id: string;

	@Column({name: 'message_id'})
	messageId: string;

	@Column({name: 'viewer_id'})
	viewerId: string;

  @ManyToOne(() => Message, (entity: Message) => entity.messageId )
  @JoinColumn({name: 'message_id'})
  message: Message;

  @ManyToOne(() => User, (entity: User) => entity.userId)
  @JoinColumn({name: "viewer_id"})
  viewer: User;
}
