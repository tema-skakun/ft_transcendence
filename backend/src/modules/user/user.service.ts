import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from '../../entities/user/user.dto';
import { User } from "../../entities/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		) {}

	createUser(userDto: UserDto) {
		const newUser = this.userRepository.create(userDto);
		return this.userRepository.save(newUser);
	}

	getUsers() {
		return this.userRepository.find();
	}

	findUniqueByEmail(email: string) {
		return this.userRepository.findOneBy({
			email: email,
		});
	}

	findUniqueByusername(username: string) {
		return this.userRepository.findOneBy({
			username: username,
		});
	}

	findUsersById(id: number) {
		return this.userRepository.findOneBy({
			intra_id: id,
		});
	}
	
	async updateUsernameAndPic(userid: number, newUsername: string, newPicUrl: string) {
		await this.userRepository.update({
			intra_id: userid, },  {
			picture_url: newPicUrl,
		});
		try {
			await this.userRepository.update({
				intra_id: userid, },   {
					username: newUsername,
				});
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}

	async deleteuser(id: number) {
		this.userRepository.delete({
			intra_id: id,
		})
	}

	async validateUser(user: any): Promise<User> {
		const usr = await this.userRepository.findOneBy({
			email: user.email,
			intra_id: user.id,
			accessToken: user.token,
		})
		return usr;
	}

	async setTwoFactorAuthenticationSecret(secret: string, userid: number) {
		return await this.userRepository.update({
			intra_id: userid, }, {
		  	twoFactorAuthenticationSecret: secret,
		});
	}

	async turnOnTwoFactorAuthentication(intra_id: number) {
		return this.userRepository.update(intra_id, {
		  isTwoFactorAuthenticationEnabled: true
		});
	}

	async findUserChannels(intra_id: number) {
		const user = await this.userRepository.findOne({
			where: { intra_id },
			relations: ['channels']
		  });
		// const channels = user.channels;
		console.log('User channels: ' + user.channels);
		return user.channels;
	}
}