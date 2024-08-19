import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { FundModule } from './fund/fund.module';
import { FeedbackModule } from './feedback/feedback.module';
// import { VectorStoreService } from './services/vector-store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
require('dotenv').config();

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
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'local'
        ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?retryWrites=true&w=majority&appName=FinnomenaFeedback`
        : `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?replicaSet=frontier&readPreference=secondary&authSource=admin`,
    ),
  ],
})
export class AppModule {}
