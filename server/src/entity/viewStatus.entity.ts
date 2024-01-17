
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class ViewStatus {
  
  @PrimaryGeneratedColumn('uuid', {name: 'view_id'})
  view_id: string;

  @ManyToOne(() => Message, (entity: Message) => entity.messageId )
  @JoinColumn({name: 'message_id'})
  messageId: Message;

  @ManyToOne(() => User, (entity: User) => entity.userId)
  @JoinColumn({name: "viewer_id"})
  viewerId: User;
}
