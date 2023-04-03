import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PostGroup } from 'src/post-group/data/post-group.schema';
import { Post } from 'src/post/data/post.schema';

@Injectable()
export class RedisManagerService {
  private logger = new Logger('RedisManagerService');
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  /**
   * Set the object in Redis
   * @param key Key to identify the object
   * @param value Objet for the key
   */
  async setCache(key: string, value: Post): Promise<string> {
    await this.cacheManager.set(key, value);
    return 'OK';
  }
  /**
   * Return the object that matches key in Redis
   * @param key Key to identify the object
   * @returns object when the item exist in Redis
   * @returns undefined when the item is not exist in Redis
   */

  async setGroupCache(key: string, value: PostGroup): Promise<string> {
    await this.cacheManager.set(key, value);
    return 'OK';
  }
  async getGroupCache(key: string): Promise<PostGroup | null> {
    try {
      return await this.cacheManager.get(key);
    } catch (e) {
      console.error(e);
      this.logger.error('Redis can not connect Check Redis [/]');
      return null;
    }
  }

  async getCache(key: string): Promise<Post | null> {
    try {
      return await this.cacheManager.get(key);
    } catch (e) {
      console.error(e);
      this.logger.error('Redis can not connect Check Redis [/]');
      return null;
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
