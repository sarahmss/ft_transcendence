
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class HideMessage {
  
  @PrimaryGeneratedColumn('uuid', {name: 'view_id'})
  view_id: string;

  @ManyToOne(() => Message, (entity: Message) => entity.messageId )
  @JoinColumn({name: 'message_id'})
  messageId: Message;

  @ManyToOne(() => User, (entity: User) => entity.userId)
  @JoinColumn({name: "target_id"})
  targetId: User;

  @ManyToOne(() => Room, (entity: Room) => entity.roomId)
  @JoinColumn({name: "room_id"})
  roomId: Room;
}
