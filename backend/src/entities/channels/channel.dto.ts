import { IsArray, IsNumber } from "class-validator"

export class ChannelDto {
	@IsArray()
	@IsNumber(undefined, {each: true})
	users: number []
}
