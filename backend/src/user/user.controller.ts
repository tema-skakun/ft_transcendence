import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
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
		return this.userservice.updateUsername(dto);
	}

	@Delete('delete')
	deleteusr() {
		this.userservice.deleteuser(87183);
	}
}