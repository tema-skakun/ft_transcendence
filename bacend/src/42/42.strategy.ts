import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from 'passport-42';
import { Get, Injectable } from "@nestjs/common";
import axios from "axios";
import { User } from "src/typeorm";
import { UserService } from "src/user/user.service";
import { addAbortSignal } from "stream";

@Injectable()
export class Forty2Strategy extends PassportStrategy(Strategy, '42') {
	constructor(private userservice: UserService,) {
		super({
			clientID: 'u-s4t2ud-13c0b288c085cc7ea7e00c35299630ea691a16f62e69df962c35df1e235d3664',
			clientSecret: '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',
			callbackURL: 'http://localhost:3333/auth/42/callback',
			scope: ['public'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done:
		 VerifyCallback): Promise<User> {
			const usr = await this.userservice.findUniqueByEmail(profile.emails[0]);
			if (usr)
			{
				return done(null, usr);
			}
			else {
				const apiClient = axios.create({
					baseURL: 'https://api.intra.42.fr',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					}
				})
				const apiResponse = await apiClient.get('/v2/users/' + profile.id);
				const user = {
					intra_id: apiResponse.data.id,
					email: apiResponse.data.email,
					username: apiResponse.data.login,
					picture_url: apiResponse.data.image.versions.medium,
					first_name: apiResponse.data.first_name,
					last_name: apiResponse.data.last_name,
					accessToken,
					refreshToken,
				}
				return done(null, await this.userservice.createUser(user))
			}
		 }
}