import { IsBoolean, IsNumber, IsString } from "class-validator"
import { User } from "../user/user.entity";

export class ChannelDto {
	@IsString()
	name?: string;
  
	@IsBoolean()
	isPrivate?: boolean;
  
	@IsString()
	password?: string;
  
	owner?: User;
  
	users: User[];
  
	administrators?: User[];

}