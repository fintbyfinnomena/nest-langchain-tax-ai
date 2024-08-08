import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StoredMessageData } from '@langchain/core/messages';
import { TaxChatMessage } from 'src/types/chatHistory.types';
import { HydratedDocument } from 'mongoose';

// this TaxChatMessageImp use for declare type of mongoose schema only, please use TaxChatMessage instead for implementation
export class TaxChatMessageImp implements TaxChatMessage {
  @Prop({ type: String, required: true })
  actor: 'ai' | 'human';

  @Prop({ type: [Object], default: [] })
  baseMessage: StoredMessageData;

  @Prop({ type: Boolean, default: false })
  is_thumb_down: boolean;
}

export type TaxChatHistoryDocument = HydratedDocument<TaxChatHistory>;

@Schema({ timestamps: true })
export class TaxChatHistory {
  @Prop({ required: true })
  user_id: string;

  @Prop({ default: false })
  has_thumb_down: boolean;

  @Prop({ type: [TaxChatMessageImp], default: [] })
  messages: TaxChatMessage[];
}

export const TaxChatHistorySchema =
  SchemaFactory.createForClass(TaxChatHistory);
