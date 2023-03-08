import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisManagerModule } from '../../redis-manager/redis-manager.module';
import { UserController } from '../controller/user.controller';
import { UserSchema, UserReadOnlySchema } from '../dto/User.Schema';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { MicroserviceDataWrapper } from '../common/ microservice-data-wrapper';
import { UserCreateDTo } from '../dto/UserCreateDTO';
import { UserMicroServiceDTO } from '../dto/UserDto';

let k: UserCreateDTo = new UserCreateDTo();

describe('UserService', () => {
  let service: UserService;
  let repo: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        RedisManagerModule,
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([
          { name: UserSchema.name, schema: UserReadOnlySchema },
        ]),
      ],
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', async () => {
    console.log('zdf1');
    // let k = new UserCreateDTo();
    k.email = 'ss';
    k.nickname = 'fdfd';
    k.profileimage = 'fdf';
    k.password = 'dg';
    console.log('zdf2');

    await repo.createuser(k);
    console.log('zdf');
  });

  it('ShowMyPage', () => {
    //   service.showMyPage('r');
    //repo.getUserFromDB('r');
  });
});
