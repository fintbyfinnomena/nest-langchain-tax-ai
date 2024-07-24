// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const isLocalEnv = process.env.NODE_ENV === 'local'; // Adjust based on your local environment setup
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    };

    if (!isLocalEnv) {
      redisOptions.tls = {
        host: process.env.REDIS_HOST,
      };
    }

    return new Redis(redisOptions);
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
