import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>
	) { }

	async addFriend(userId: number, friend_id: number): Promise<User> {
		const userWithoutFriend: User = await this.userRepository.findOne({
			where: {
				intra_id: userId
			},
			relations: ['friends'] // If it is undefined will it update to be undefined.
		});

		const friend: User = await this.userRepository.findOneBy({
			intra_id: friend_id
		})
	
		userWithoutFriend.friends.push(friend);
		return this.userRepository.save(userWithoutFriend);
	}
}
