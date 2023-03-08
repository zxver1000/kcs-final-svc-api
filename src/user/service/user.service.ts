import { Injectable, Logger } from '@nestjs/common';
import { RedisManagerService } from '../../redis-manager/service/redis-manager.service';
import { UserCreateDTo } from '../dto/UserCreateDTO';
import { UserMicroServiceDTO } from '../dto/UserDto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisManagerService,
    private readonly userRepository: UserRepository,
  ) {}
  async getUser(userid: string) {
    //* First find on Redis

    //* If not exist on REdis, find on DB, and add it to Redis, and return it
    const key = `user/${userid}`;
    return await this.redisService.getCache(key);
  }

  async setUser(userid: string) {
    //* Just Add it on DB
    const key = `user/${userid}`;
    const userObject = {
      id: 'test',
    };
    return await this.redisService.setCache(key, userObject);
  }
  async createusers(usercreatedto: UserCreateDTo) {
    await this.userRepository.createuser(usercreatedto);
    return 'ok';
  }

  async get_DB(email: string) {
    const result = await this.userRepository.getuser_fromEmail(email);
    return result;
  }

  async logIn() {}
  async signUp() {}
  async modifyUserInformation() {}

  async findPassword() {}
  async showMyPage(userid: string) {
    //parameter -> userid return userdto

    //Redis checking
    const cache_user = await this.getUser(userid);

    if (cache_user == undefined) {
      //redis have not cache

      const DB_user = await this.userRepository.getUserFromDB(userid);
      return DB_user;
    } else {
      return cache_user;
    }
  }
}
