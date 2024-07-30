import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

export interface ChatHistoryManager {
  GetHistoryMessagesBySessionID(sessionId: string): Promise<ChatMessageHistory>;
  SaveHistoryMessages(
    sessionId: string,
    messages: (AIMessage | HumanMessage)[],
  ): Promise<void>;
  ClearHistoryMessagesBySessionID(sessionId: string): Promise<void>;
}
