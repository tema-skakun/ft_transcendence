import { Injectable, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Forty2Strategy } from "./42/42.strategy";
import axios from "axios";
import { version } from "process";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AppService {
	constructor(
		private jwtService: JwtService,
	) {}
	async forty2Login(req: any, res: any) {
		if(!req.user) {

			return 'No user from 42'
		}
		const payload = { email: req.user.email, id: req.user.intra_id, token: req.user.accessToken};
		const token = this.jwtService.sign(payload, {secret: "qwerty"});
		res.cookie('accessToken', token);
		res.redirect('http://localhost:3000');
	}

}

