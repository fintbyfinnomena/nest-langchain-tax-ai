import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { FundModule } from './fund/fund.module';
import { FeedbackModule } from './feedback/feedback.module';
// import { VectorStoreService } from './services/vector-store.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  // imports: [ConfigModule.forRoot(), RedisModule],
  imports: [
    ConfigModule.forRoot(),
    LangchainChatModule,
    RedisModule,
    FundModule,
    ChatModule,
    FeedbackModule,
    MongooseModule.forRoot('mongodb+srv://ssatayamana:O1suwcefVVxEhIPq@finnomenafeedback.revivmp.mongodb.net/?retryWrites=true&w=majority&appName=FinnomenaFeedback'),
  ],
  // providers: [VectorStoreService],
})
export class AppModule {}
