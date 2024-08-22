// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { getRedisClient } from './client';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return getRedisClient();
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
