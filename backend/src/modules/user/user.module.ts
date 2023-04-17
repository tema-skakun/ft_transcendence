import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/gameService';
import { RelationalTable } from '../../tools/converter';
import { DebugModule } from '../../debug/debug.module';
import { UserEntity } from 'src/entities/user/user.entity';
import { UserController } from './user.controller';
import { UserCRUD } from './userCRUD.service';
import { ChannelModule } from '../channel/channel.module';




@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ChannelModule],
  controllers: [UserController],
  providers: [UserCRUD],
  exports: [UserCRUD]
})
export class UserModule {}
