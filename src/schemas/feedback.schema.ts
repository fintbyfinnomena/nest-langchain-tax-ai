
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  user_text: string;

  @Prop({ required: true })
  ai_text: string;

  @Prop({ required: true })
  user_id: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
