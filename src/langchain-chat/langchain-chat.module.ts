import { Module } from '@nestjs/common';
import { LangchainChatService } from './langchain-chat.service';
import { LangchainChatController } from './langchain-chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxChatHistorySchema } from 'src/schemas/chatHistory.schema';
// import { VectorStoreService } from 'src/services/vector-store.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chat_histories', schema: TaxChatHistorySchema },
    ]),
  ],
  controllers: [LangchainChatController],
  providers: [
    LangchainChatService,
    // VectorStoreService
  ],
})
export class LangchainChatModule {}
