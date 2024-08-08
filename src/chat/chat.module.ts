import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxChatHistorySchema } from 'src/schemas/chatHistory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chat_histories', schema: TaxChatHistorySchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
