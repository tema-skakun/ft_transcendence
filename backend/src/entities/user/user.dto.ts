import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
	@IsString()
	@IsNotEmpty()
	public name: string;
}