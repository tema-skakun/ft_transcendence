import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => UserEntity)
	users: UserEntity [];
}
