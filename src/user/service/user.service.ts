import { Injectable } from '@nestjs/common';
import { RedisManagerService } from '../../redis-manager/service/redis-manager.service';

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisManagerService) {}
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
}
