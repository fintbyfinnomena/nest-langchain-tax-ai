import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
// import { VectorStoreService } from './services/vector-store.service';

@Module({
  imports: [ConfigModule.forRoot(), LangchainChatModule, RedisModule],
  controllers: [],
  // providers: [VectorStoreService],
})
export class AppModule {}
