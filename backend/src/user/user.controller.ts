import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common'
import { AuthDto } from 'src/auth/dto';
import { User } from 'src/typeorm';
import { UserDto } from './dto';
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userservice: UserService) {
	}

	@Get('all')
	getUsers() {
		return this.userservice.getUsers();
	}

	@Put('update')
	updateUser(@Body() dto: UserDto) {
		return this.userservice.updateUsernameAndPic(dto.intra_id, dto.username, dto.picture_url);
	}

	@Post('create')
	createUser(@Body() dto: UserDto) {
		return this.userservice.createUser(dto);
	}

	@Delete('delete')
	deleteusr(@Body() id: any) {
		this.userservice.deleteuser(id.intra_id);
	}
}