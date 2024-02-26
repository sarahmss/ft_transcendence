import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class GameInvite {
  @PrimaryGeneratedColumn('uuid', {name: "game_invite"})
  gameInviteId: string;

  @ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: "CASCADE"})
  @JoinColumn({name: 'invited'})
  invited: User;

  @Column({name: 'invited'})
  invitedId: string;

  @ManyToOne(() => User, (entity: User) => entity.userId, {onDelete: "CASCADE"})
  @JoinColumn({name: 'inviter'})
  inviter: User;

  @Column({name: 'inviter'})
  inviterId: string;

  @Column({name: 'time_limit', default: new Date(Date.now() + 120000), type: 'timestamptz'})
  time_limit: Date;

  @Column({default: true})
  status: boolean;

}
