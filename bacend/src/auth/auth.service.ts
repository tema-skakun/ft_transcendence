import { toFileStream } from 'qrcode'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { User } from '../typeorm/user.entity'
import { UserService } from '../user/user.service';


@Injectable()
export class AuthService {
	constructor (
		private readonly usersService: UserService,
		private readonly configService: ConfigService,
	) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	 
		const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('LAB'), secret);
		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.intra_id);
		return {
		  secret,
		  otpauthUrl
		}
	  }

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorAuthenticationSecret,
		})
	}
}

