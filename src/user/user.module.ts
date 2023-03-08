import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { UserController } from './controller/user.controller';
import { UserSchema, UserReadOnlySchema } from './dto/User.Schema';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisManagerModule,

    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserReadOnlySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
