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

	incr_totalWins(usrEntity: User) {
		if (!usrEntity.total_wins)
			usrEntity.total_wins = 0;

		++usrEntity.total_wins;
		return this.typeormRepository.update(usrEntity.intra_id, {
			total_wins: usrEntity.total_wins
		})
	}

	incr_totalLosses(usrEntity: User) {
		if (!usrEntity.total_losses)
			usrEntity.total_losses = 0;

		++usrEntity.total_losses;
		return this.typeormRepository.update(usrEntity.intra_id, {
			total_losses: usrEntity.total_losses
		})
	}

	async getWinsToLossesRatio(intra_id: number): Promise<number | string> {
		const usr: User = await this.typeormRepository.findOneBy({
			intra_id: intra_id
		})
		if (usr.total_losses === 0) 
			return "not ranked yet";
		return usr.total_wins / usr.total_losses
	}

	async getWinsToLossesArray(): Promise<number []> {
		const usr: User [] = await this.typeormRepository.find();
		console.log(`length of usr arr: ${usr.length}`);

		const ratio_arr: number [] = [];
		for (const usrEntity of usr) {
			console.log(`total losses:  ${usrEntity.total_losses}`)
			console.log(`total wins:  ${usrEntity.total_wins}`)
			if (usrEntity.total_losses === 0)
				continue;
			else
				ratio_arr.push(usrEntity.total_wins / usrEntity.total_losses);
		}
		
		ratio_arr.sort();
		return ratio_arr;
	}
}