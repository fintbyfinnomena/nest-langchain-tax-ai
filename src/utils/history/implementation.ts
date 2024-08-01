import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Redis } from 'ioredis';
import { ChatHistoryManager } from './interface';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import { TaxChatMessage } from '../../types/chatHistory.types';
import { HydratedDocument, Model, UpdateQuery } from 'mongoose';
import { TaxChatHistory } from 'src/schemas/chatHistory.schema';

export class ChatHistoryManagerImp implements ChatHistoryManager {
  private redis: Redis;
  private chatHistoryModel: Model<TaxChatHistory>;
  constructor(redis: Redis, chatHistoryModel: Model<TaxChatHistory>) {
    this.redis = redis;
    this.chatHistoryModel = chatHistoryModel;
  }

  async InitChat(user_id: string): Promise<HydratedDocument<TaxChatHistory>> {
    const chat = await this.chatHistoryModel.create({ user_id });
    return chat;
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

  async GetChatHistoryByChatID(
    chatId: string,
  ): Promise<HydratedDocument<TaxChatHistory>> {
    const chat = await this.chatHistoryModel.findById(chatId);
    return chat;
  }

  async SaveHistoryMessagesCache(
    chatId: string,
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
    await this.redis.set(chatId, value);
    return;
  }

  // need to refactor later for cleanliness
  async AddMessagesToChatHistoryDB(
    chatId: string,
    messages: TaxChatMessage[],
  ): Promise<void> {
    const payload: UpdateQuery<TaxChatHistory> = {
      $push: {
        messages,
      },
    };
    await this.chatHistoryModel.updateOne({ _id: chatId }, payload);
  }

  async SetThumbDownInChatHistoryDB(
    chatId: string,
    index: number,
  ): Promise<void> {
    const payload: UpdateQuery<TaxChatHistory> = {
      $set: {
        has_thumb_down: true,
        [`messages.${index}.is_thumb_down`]: true,
      },
    };
    await this.chatHistoryModel.updateOne({ _id: chatId }, payload);
  }
}
