import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { FundModule } from './fund/fund.module';
// import { VectorStoreService } from './services/vector-store.service';

@Module({
  // imports: [ConfigModule.forRoot(), RedisModule],
  imports: [
    ConfigModule.forRoot(),
    LangchainChatModule,
    RedisModule,
    FundModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  // providers: [VectorStoreService],
})
export class AppModule {}
