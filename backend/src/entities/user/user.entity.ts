import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ChannelEntity } from "../channels/channel.entity";

@Entity()
@Unique(["name"])
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => ChannelEntity)
	channels: ChannelEntity [];	
}
