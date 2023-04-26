import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Archivements } from "../archivements/archivments.entity";
import { MatchHistoryEntry } from "../matchHistoryEntry/matchHistoryEntry.entity";

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

	// @OneToMany(() => MatchHistoryEntry)
	// matchHistory: MatchHistoryEntry [];

	@OneToMany(() => MatchHistoryEntry, (entry) => entry.winner)
	wonGames: MatchHistoryEntry [];

	@OneToMany(() => MatchHistoryEntry, (entry) => entry.looser)
	lostGames: MatchHistoryEntry [];

	@Column({default: 0})
	total_wins: number;

	@Column({default: 0})
	total_losses: number;

	@OneToMany(() => Archivements, (arch: Archivements) => arch.holder)
	archivements: Archivements [];
}