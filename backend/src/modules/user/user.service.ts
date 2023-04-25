import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from '../../entities/user/user.dto';
import { User } from "../../entities/user/user.entity";
import { Repository } from "typeorm";
import { MatchHistoryEntry } from "src/entities/matchHistoryEntry/matchHistoryEntry.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly typeormRepository: Repository<User>,
		) {}

	createUser(authDto: UserDto) {
		const newUser = this.typeormRepository.create(authDto);
		return this.typeormRepository.save(newUser);
	}

	getUsers() {
		return this.typeormRepository.find();
	}

	findUniqueByEmail(email: string) {
		return this.typeormRepository.findOneBy({
			email: email,
		});
	}

	findUniqueByusername(username: string) {
		return this.typeormRepository.findOneBy({
			username: username,
		});
	}

	findUsersById(id: number) {
		return this.typeormRepository.findOneBy({
			intra_id: id,
		});
	}
	
	findUserByIdAndGetRelated(id:number, nameOfRelated: string []) {
		return this.typeormRepository.findOne({
			where: {
				intra_id: id
			},
			relations: nameOfRelated
		});
	}

	async updateUsernameAndPic(userid: number, newUsername: string, newPicUrl: string) {
		await this.typeormRepository.update({
			intra_id: userid, },  {
			picture_url: newPicUrl,
		});
		try {
			await this.typeormRepository.update({
				intra_id: userid, },   {
					username: newUsername,
				});
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}

	async deleteuser(id: number) {
		this.typeormRepository.delete({
			intra_id: id,
		})
	}

	async validateUser(user: any): Promise<User> {
		const usr = await this.typeormRepository.findOneBy({
			email: user.email,
			intra_id: user.id,
			accessToken: user.token,
		})
		return usr;
	}

	async setTwoFactorAuthenticationSecret(secret: string, userid: number) {
		return await this.typeormRepository.update({
			intra_id: userid, }, {
		  	twoFactorAuthenticationSecret: secret,
		});
	}

	async turnOnTwoFactorAuthentication(intra_id: number) {
		return this.typeormRepository.update(intra_id, {
		  isTwoFactorAuthenticationEnabled: true
		});
	}
}