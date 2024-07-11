import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { FundModule } from './fund/fund.module';
// import { VectorStoreService } from './services/vector-store.service';

@Module({
  imports: [ConfigModule.forRoot(), LangchainChatModule, FundModule],
  controllers: [],
  // providers: [VectorStoreService],
})
export class AppModule {}
