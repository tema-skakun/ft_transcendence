import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [TypeOrmModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}