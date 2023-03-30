import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { TypeormService } from "src/typeorm/typeorm.service";
import { UserService } from "src/user/user.service";

@Controller('auth')
export class AuthController{
	
}