import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserDto } from "src/entities/user/user.dto";
import { UserCRUD } from "./userCRUD.service";

@Controller('user')
export class UserController {

	constructor(
		private userCRUD: UserCRUD
	) {}

	@Post('/new')
	createUser(@Body() userInfo: UserDto) {
		this.userCRUD.create(userInfo);
	}

	@Get('/:id')
	getUser(@Param() id: string) {
		this.userCRUD.read(id);
	}
}
