import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { userInfo } from "os";


@Injectable()
export class JWTStrategy implements CanActivate {
	constructor(
		private jwtservice: JwtService,
		private userservice: UserService,) {
	}
	canActivate(context: ExecutionContext,
		): boolean | Promise<boolean> | Observable<boolean> {
		console.log('jwt constr');
		return this.validateUser(context);
	}
	async validateUser(context: ExecutionContext) {
		const request = await context.switchToHttp().getRequest();
		try {
			const decoded = await this.jwtservice.verify(context.getArgByIndex(1), {secret: 'qwerty'});
			if (!decoded.id || !decoded.email || !decoded.token)
				return false;
		const usr = await this.userservice.validateUser(decoded);
		if (!usr)
			return false;
		const userinfo = {
			username: usr.username,
			full_name: usr.first_name + ' ' + usr.last_name,
			email: usr.email,
			picture_url: usr.picture_url,
		}
		request.user = userinfo;
			return true;
		} catch {
			return false;
		}
	}
}