import { ForbiddenException, Injectable } from "@nestjs/common";
import { ModuleTokenFactory } from "@nestjs/core/injector/module-token-factory";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthDto } from "src/auth/dto";
import { User } from "src/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly typeormRepository: Repository<User>,
		) {}

	createUser(authDto: AuthDto) {
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
	
	public async updateUsername(updatedUser: AuthDto) {
		const user = await this.typeormRepository.findOneBy({
			username: updatedUser.username,
		})
		if (user)
			throw new ForbiddenException('Username already exists');
		const user1 = await this.typeormRepository.findOneBy({
			email: updatedUser.email,
		})
		if (user1)
		{
			return await this.typeormRepository.update(user1.id, {
				username: updatedUser.username,
			});
		}
		else
			throw new ForbiddenException('You are not in database');
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

}