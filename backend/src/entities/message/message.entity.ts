import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn({
	name: 'created_at',
	})
  createdAt: Date;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Channel)
  channel: Channel;
}