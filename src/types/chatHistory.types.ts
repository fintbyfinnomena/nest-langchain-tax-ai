import { StoredMessageData } from '@langchain/core/messages';

export interface TaxChatMessage {
  actor: 'ai' | 'human';
  baseMessage: StoredMessageData;
  is_thump_down?: boolean;
}
