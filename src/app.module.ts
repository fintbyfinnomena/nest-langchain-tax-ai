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
import { getConfig } from './config/tax.chat.config';

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
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'local'
        ? `mongodb://${config.mongoUsername}:${config.mongoPassword}@${config.mongoHost}:${process.env.MONGO_PORT}/?retryWrites=true&w=majority&appName=FinnomenaFeedback`
        : `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@${config.mongoHost}/?retryWrites=true&w=majority&appName=FinnomenaFeedback`,
    ),
  ],
})
export class AppModule {}
