import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Connections {
	@PrimaryGeneratedColumn("uuid")
  connectionId: string;

  @Column({ nullable: false })
  client: string;

  @ManyToOne(() => User, (user: User) => user.userId, { nullable: false, onDelete: 'CASCADE' })
  user: User;
}
