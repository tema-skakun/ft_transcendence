import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column({ nullable: true })
	name?: string;
  
	@Column({ default: false })
	isPrivate: boolean;

	@Column({ default: true })
	isDC: boolean;
  
	@Column({ nullable: true })
	password?: string;
  
	@ManyToOne(() => User, user => user.ownedChannels)
	owner?: User;
  
	@ManyToMany(() => User, user => user.channels)
	@JoinTable()
	users: User[];
  
	@ManyToMany(() => User, user => user.administeredChannels)
	@JoinTable()
	administrators?: User[];
}