import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisManagerModule } from 'src/redis-manager/redis-manager.module';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule.forRoot(), RedisManagerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
