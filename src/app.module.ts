import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { FundModule } from './fund/fund.module';
import { FeedbackModule } from './feedback/feedback.module';
// import { VectorStoreService } from './services/vector-store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
import { getConfig } from './config/tax.chat.config';
import { getRedisClient } from './redis/client';

const config = getConfig();
@Module({
  // imports: [ConfigModule.forRoot(), RedisModule],

  imports: [
    ConfigModule.forRoot(),
    LangchainChatModule,
    RedisModule,
    FundModule,
    ChatModule,
    FeedbackModule,
    CustomerModule,
    MongooseModule.forRoot(config.mongoConnString),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 1000, ttl: seconds(1) }],
      storage: new ThrottlerStorageRedisService(getRedisClient()),
    }),
  ],
})
export class AppModule {}
