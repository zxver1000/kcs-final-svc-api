import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserMicroServiceDTO } from 'src/user/dto/UserDto';

@Injectable()
export class RedisManagerService {
  private logger = new Logger('User - Redis');
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Set the object in Redis
   * @param key Key to identify the object
   * @param value Objet for the key
   */
  async setCache(key: string, value: object): Promise<string> {
    await this.cacheManager.set(key, value);
    return 'OK';
  }

  /**
   * Return the object that matches key in Redis
   * @param key Key to identify the object
   * @returns object when the item exist in Redis
   * @returns undefined when the item is not exist in Redis
   */
  async getCache(key: string): Promise<UserMicroServiceDTO | null> {
    try {
      return await this.cacheManager.get(key);
    } catch (e) {
      this.logger.error('Redis can not connect Check Redis [/]');
      return undefined;
    }
  }

  /**
   * Delete the object that matches key in Redis
   * @param key Key to delete from Redis
   * @returns 'OK' when succeeded
   */
  async deleteCache(key: string): Promise<string> {
    await this.cacheManager.del(key);
    return 'OK';
  }

  /**
   * Reset all the data stored in Redis
   * @returns 'OK' when succeeded
   */
  async resetCache(): Promise<string> {
    await this.cacheManager.reset();
    return 'OK';
  }
}
