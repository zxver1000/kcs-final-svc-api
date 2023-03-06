import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [ConfigModule.forRoot(), RedisManagerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
