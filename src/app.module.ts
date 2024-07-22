import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { FundModule } from './fund/fund.module';
import { FeedbackModule } from './feedback/feedback.module';
// import { VectorStoreService } from './services/vector-store.service';
import { MongooseModule } from '@nestjs/mongoose';
require('dotenv').config();

console.log('process.env.MONGO_USERNAME', process.env.MONGO_USERNAME);
console.log('process.env.MONGO_PASSWORD', process.env.MONGO_PASSWORD);
console.log('process.env.MONGO_HOST', process.env.MONGO_HOST);
@Module({
  // imports: [ConfigModule.forRoot(), RedisModule],

  imports: [
    ConfigModule.forRoot(),
    LangchainChatModule,
    RedisModule,
    FundModule,
    ChatModule,
    FeedbackModule,
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'local'
        ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?retryWrites=true&w=majority&appName=FinnomenaFeedback`
        : `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority&appName=FinnomenaFeedback`,
    ),
  ],
})
export class AppModule {}
