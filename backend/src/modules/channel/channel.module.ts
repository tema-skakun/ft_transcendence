import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/gameService';
import { RelationalTable } from '../../tools/converter';
import { DebugModule } from '../../debug/debug.module';
import { ChannelController } from './channel.controller';
import { UserModule } from '../user/user.module';
import { ChannelEntity } from 'src/entities/channels/channel.entity';
import { ChannelCRUD } from './channelCRUD.service';


@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([ChannelEntity])],
  controllers: [ChannelController],
  providers: [ChannelCRUD],
  exports: [ChannelCRUD]
})
export class ChannelModule {}
