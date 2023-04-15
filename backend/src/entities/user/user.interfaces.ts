import { ChannelEntity } from "../channels/channel.entity";

export interface UserInterface {
	name: string;
	channels?: ChannelEntity [];	
}
