import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/entities/user/user.dto";
import { UserEntity } from "src/entities/user/user.entity";
import { Repository, FindManyOptions } from "typeorm";

import { UserTransformed } from "src/entities/user/user.transformed";
import { entityToTransformed, entityToTransformedArr } from "src/tools/transformer";
import { ChannelCRUD } from "../channel/channelCRUD.service";


@Injectable()
export class UserCRUD {
	constructor(
		@InjectRepository(UserEntity) private  rep: Repository<UserEntity>,
		private channelCRUD: ChannelCRUD
	) {}

	create(userInfo: UserDto) {
		const userEntity: UserEntity = new UserEntity;
		userEntity.name = userInfo.name;
		userEntity.channels = [];
		this.rep.save(userEntity);
	}

	async read(userid: string) {
		const count: any = await this.rep.find({
			select: ['id']
		});

		console.log(`count: ${JSON.stringify(count, null, 2)}`);
	}

	async readAll(): Promise<UserTransformed []> {
		return (entityToTransformedArr(await this.rep.find(), UserTransformed));
	}

	async query(options: FindManyOptions<UserEntity>) {
		return (this.rep.find(options))
	}

	async update(id: number, userInterface: UserDto) {
		
		// this.rep.update(id, userInterface);
	}
}
