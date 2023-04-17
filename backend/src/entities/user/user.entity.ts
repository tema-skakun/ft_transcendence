import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

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