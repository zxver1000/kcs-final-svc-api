import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisManagerService } from './redis-manager.service';
import * as redisStore from 'cache-manager-redis-store';
import { RedisManagerModule } from './redis-manager.module';
import { Cache } from 'cache-manager';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('RedisManagerService', () => {
  let redisService: RedisManagerService;
  let cache: Cache;
  beforeEach(async () => {
    //* Mocking Module
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register({
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
        RedisManagerModule,
      ],
      providers: [
        RedisManagerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    redisService = moduleRef.get<RedisManagerService>(RedisManagerService);
    cache = moduleRef.get(CACHE_MANAGER);
  });

  describe('set', () => {
    it('should be defined', () => {
      expect(redisService.setCache).toBeDefined();
    });

    it('should return Ok', async () => {
      const spy = jest.spyOn(cache, 'set');

      await redisService.setCache('test', { key: 'test' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toEqual('test');
      expect(spy.mock.calls[0][1]).toEqual({ key: 'test' });
    });
  });

  describe('get', () => {
    it('should be defined', () => {
      expect(redisService.getCache).toBeDefined();
    });

    it('should return test', async () => {
      const spy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce({ key: 'test' });

      const res = await redisService.getCache('test');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ key: 'test' });
    });
  });
  describe('del', () => {
    it('should be defined', () => {
      expect(redisService.deleteCache).toBeDefined();
    });

    it('should return "OK"', async () => {
      const result = await redisService.deleteCache('test');
      expect(result).toBe('OK');
    });
  });
});
