
import { Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';
import { Membership } from './membership.entity';


@Entity()
export class Room {

	@PrimaryGeneratedColumn('uuid')
	roomId: string;

	@Column({ default: 'Default name'} )
	roomName: string;

	@Column()
	roomType: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@OneToMany(() => Membership,
			   (entity: Membership) => entity.roomId)
	member: Membership[];
}

@Entity()
export class GroupRoom {

	@PrimaryGeneratedColumn('uuid', { name: 'group_chat_id' })
	roomGId: string;

	@OneToOne(() => User, (entity: User) => entity.userId)
	@JoinColumn( {name: 'room_id'})
	roomId: Room;

	@Column( {default: true, name: "is_private" } )
	isPrivate: boolean;

	@Column( { default: false } )
	protected: boolean;

	@Column( { default: null, nullable: true } )
	password: string;
}

@Entity()
export class DirectRoom {

	@PrimaryGeneratedColumn('uuid',
							{ name: 'direct_chat_id' })
	roomDId: string;

	@OneToOne( () => Room,
			  (entity: Room) => entity.roomId )
	@JoinColumn( { name: 'room_id'} )
	roomId: Room;

}
