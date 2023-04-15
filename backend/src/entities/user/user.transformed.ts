import { Transform, Expose } from 'class-transformer';

export class UserTransformed {
	@Expose()
	name: string;
}
