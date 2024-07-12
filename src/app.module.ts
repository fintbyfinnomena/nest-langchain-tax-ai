import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { FundModule } from './fund/fund.module';
// import { VectorStoreService } from './services/vector-store.service';

@Module({
  // imports: [ConfigModule.forRoot(), RedisModule],
  imports: [
    ConfigModule.forRoot(),
    LangchainChatModule,
    RedisModule,
    FundModule,
    ChatModule,
  ],
  // providers: [VectorStoreService],
})
export class AppModule {}
