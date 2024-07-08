import { BaseMessage } from '@langchain/core/messages';

export interface ChatHistoryManager {
  GetHistoryMessagesBySessionID(sessionID: string): Promise<BaseMessage[]>;
  SaveHistoryMessages(
    sessionID: string,
    messages: BaseMessage[],
  ): Promise<void>;
  ClearHistoryMessagesBySessionID(sessionID: string): Promise<void>;
}
