import { Global, Module } from "@nestjs/common";
import { TypeormService } from "./typeorm.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User]),],
	providers: [TypeormService],
	exports: [TypeormService],
})
export class TypeormModule {}