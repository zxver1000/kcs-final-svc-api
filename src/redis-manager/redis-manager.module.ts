import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisManagerService } from './redis-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [RedisManagerService],
  exports: [RedisManagerService],
})
export class RedisManagerModule {}
