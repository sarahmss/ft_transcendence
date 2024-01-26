import { Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity()
export class Ban {
  @PrimaryGeneratedColumn('uuid', {name: "ban_id"})
  banId: string;

  @ManyToOne(() => User, (entity: User) => entity.userId)
  @JoinColumn({name: 'banned_id'})
  banned: User;

  @Column({name: 'banned_id'})
  bannedId: string;

  @Column({name: "room_id"})
  roomId: string;

  @Column({type: 'timestamptz'})
  ban_end: Date;

  @ManyToOne(() => Room, (entity: Room) => entity.roomId)
  @JoinColumn({name: 'room_id'})
  room: Room;
}
