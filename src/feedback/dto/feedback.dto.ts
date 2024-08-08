import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
    @IsNotEmpty()
    @IsString()
    user_text: string;
    ai_text: string;
    user_id: string;
}