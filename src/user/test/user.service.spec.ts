import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisManagerModule } from '../../redis-manager/redis-manager.module';
import { UserCreateDto } from '../data/dto/user-create.dto';
import { UserRepository } from '../data/user.repository';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

let k: UserCreateDto = new UserCreateDto();

describe('UserService', () => {
  let service: UserService;
  let repo: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
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
    k.password = 'dg';
    console.log('zdf2');

    await repo.findById(k);
    console.log('zdf');
  });

  it('ShowMyPage', () => {
    //   service.showMyPage('r');
    //repo.getUserFromDB('r');
  });
});
