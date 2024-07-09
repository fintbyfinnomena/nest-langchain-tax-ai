import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { Redis } from 'ioredis';
import { ChatHistoryManager, CustomMessage } from './interface';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

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
  ): Promise<ChatMessageHistory> {
    const userChatHistory = new ChatMessageHistory();

    const value = await this.redis.get(sessionID);
    if (!value) {
      return userChatHistory;
    }
    const messages: CustomMessage[] = JSON.parse(value);
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
    sessionID: string,
    messages: BaseMessage[],
  ): Promise<void> {
    messages[0].toDict();
    const customMessages: CustomMessage[] = [];
    for (const message of messages) {
      if (message instanceof AIMessage) {
        customMessages.push({
          actor: 'ai',
          baseMessage: message.content.toString(),
        });
      } else if (message instanceof HumanMessage) {
        customMessages.push({
          actor: 'human',
          baseMessage: message.content.toString(),
        });
      }
    }
    await this.redis.set(sessionID, JSON.stringify(customMessages));
    return;
  }
}
