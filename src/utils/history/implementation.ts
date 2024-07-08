import { BaseMessage } from '@langchain/core/messages';
import { Redis } from 'ioredis';
import { ChatHistoryManager } from './interface';

export class ChatHistoryManagerImp implements ChatHistoryManager {
  private redis: Redis;
  constructor(redis: Redis) {
    this.redis = redis;
  }
  async ClearHistoryMessagesBySessionID(sessionID: string): Promise<void> {
    await this.redis.del(sessionID);
    return;
  }
  async GetHistoryMessagesBySessionID(
    sessionID: string,
  ): Promise<BaseMessage[]> {
    const value = await this.redis.get(sessionID);
    if (!value) {
      return [];
    }
    const messages = JSON.parse(value);
    return messages;
  }
  async SaveHistoryMessages(
    sessionID: string,
    messages: BaseMessage[],
  ): Promise<void> {
    await this.redis.set(sessionID, JSON.stringify(messages));
    return;
  }
}
