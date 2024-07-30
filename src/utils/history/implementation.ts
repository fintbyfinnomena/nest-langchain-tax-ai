import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Redis } from 'ioredis';
import { ChatHistoryManager } from './interface';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import { TaxChatMessage } from '../../types/chatHistory.types';
import { Model } from 'mongoose';
import { TaxChatHistory } from 'src/schemas/chatHistory.schema';

export class ChatHistoryManagerImp implements ChatHistoryManager {
  private redis: Redis;
  private chatHistoryModel: Model<TaxChatHistory>;
  constructor(redis: Redis, chatHistoryModel: Model<TaxChatHistory>) {
    this.redis = redis;
    this.chatHistoryModel = chatHistoryModel;
  }
  async ClearHistoryMessagesBySessionID(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
    return;
  }
  async GetHistoryMessagesBySessionID(
    sessionId: string,
  ): Promise<ChatMessageHistory> {
    const userChatHistory = new ChatMessageHistory();

    const value = await this.redis.get(sessionId);
    if (!value) {
      return userChatHistory;
    }
    const messages: TaxChatMessage[] = JSON.parse(value);

    messages.forEach((message) => {
      if (message.actor === 'ai') {
        userChatHistory.addMessage(new AIMessage(message.baseMessage));
      } else {
        userChatHistory.addMessage(new HumanMessage(message.baseMessage));
      }
    });

    return userChatHistory;
  }
  async SaveHistoryMessages(
    sessionId: string,
    messages: (AIMessage | HumanMessage)[],
  ): Promise<void> {
    const customMessages: TaxChatMessage[] = [];
    for (const message of messages) {
      if (message instanceof AIMessage) {
        customMessages.push({
          actor: 'ai',
          baseMessage: message.toDict().data,
        });
      } else if (message instanceof HumanMessage) {
        customMessages.push({
          actor: 'human',
          baseMessage: message.toDict().data,
        });
      }
    }
    const value = JSON.stringify(customMessages);
    await this.redis.set(sessionId, value);
    return;
  }
}
