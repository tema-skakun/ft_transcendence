import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";

@Entity()
export class User {
	@PrimaryColumn({
		type: 'bigint',
	})
	intra_id: number;

	
	@CreateDateColumn({
		name: 'created_at',
	})
	created_at: Date;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updated_at: Date;

	@Column({
		nullable: false,
		default: '',
		unique: true,
	})
	username: string;

	@Column({
		name: 'email',
		nullable: false,
		default: '',
		unique: true,
	})
	email: string;

	@Column({
		default: '',
	})
	first_name?: string;

	@Column({
		default: '',
	})
	last_name?: string;

	@Column({
		default: '',
	})
	picture_url?: string;

	@ManyToMany(() => User, user => user.blockedUsers)
	@JoinTable()
	blockedBy?: User[];

	@ManyToMany(() => User, user => user.blockedBy)
  	blockedUsers?: User[];

	@OneToMany(() => Channel, channel => channel.owner)
	ownedChannels?: Channel[];

	@ManyToMany(() => Channel, channel => channel.users)
  	channels?: Channel[];

	@ManyToMany(() => Channel, channel => channel.administrators)
	administeredChannels?: Channel[];

	@Column({
		default: '',
	})
	accessToken?: string;

	@Column({
		default: '',
	})
	refreshToken?: string;

	@Column({ nullable: true })
  	twoFactorAuthenticationSecret?: string;

	@Column({ default: false })
	isTwoFactorAuthenticationEnabled: boolean;

}