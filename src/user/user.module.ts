import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { UserController } from './user.controller';
import { UserRepository } from './data/user.repository';
import { UserService } from './user.service';
import { User, _UserSchema } from './data/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisManagerModule,
    MongooseModule.forFeature([{ name: User.name, schema: _UserSchema }]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.Email_auth_email,
          pass: process.env.Email_auth_password,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
