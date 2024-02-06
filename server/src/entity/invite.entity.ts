
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid', {name: 'invite_id'})
  inviteId: string;

  @Column({name: 'user_id'})
  userId: string;

  @Column({name: 'room_id'})
  roomId: string;

  @ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User

  @ManyToOne(() => Room, (entity: Room) => entity.roomId, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'room_id'})
  room: Room;


  @Column({default: true})
  valid: boolean;

  @Column({
    type: 'timestamptz',
    name: 'time_limit',
    default: new Date(Date.now() + 3600000)
  })
  timeLimit: Date;
}
