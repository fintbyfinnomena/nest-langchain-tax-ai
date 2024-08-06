import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import { HydratedDocument } from 'mongoose';
import { TaxChatHistory } from 'src/schemas/chatHistory.schema';
import { TaxChatMessage } from 'src/types/chatHistory.types';

export interface ChatHistoryManager {
  GetHistoryMessagesBySessionID(sessionId: string): Promise<ChatMessageHistory>;
  SaveHistoryMessagesCache(
    chatId: string,
    messages: (AIMessage | HumanMessage)[],
  ): Promise<void>;
  ClearHistoryMessagesBySessionID(sessionId: string): Promise<void>;
  AddMessagesToChatHistoryDB(
    chatId: string,
    messages: TaxChatMessage[],
  ): Promise<void>;
  SetThumbDownInChatHistoryDB(chatId: string, index: number): Promise<void>;
  GetChatHistoryByChatID(
    chatId: string,
  ): Promise<HydratedDocument<TaxChatHistory>>;
  InitChat(user_id: string): Promise<HydratedDocument<TaxChatHistory>>;
  GetLatestChatHistoryByUserID(
    user_id: string,
  ): Promise<HydratedDocument<TaxChatHistory>>;
}
