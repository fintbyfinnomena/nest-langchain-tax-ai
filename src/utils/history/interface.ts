import { BaseMessage } from '@langchain/core/messages';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

export interface ChatHistoryManager {
  GetHistoryMessagesBySessionID(sessionID: string): Promise<ChatMessageHistory>;
  SaveHistoryMessages(
    sessionID: string,
    messages: BaseMessage[],
  ): Promise<void>;
  ClearHistoryMessagesBySessionID(sessionID: string): Promise<void>;
}

export interface CustomMessage {
  actor: 'ai' | 'human';
  baseMessage: string;
}
