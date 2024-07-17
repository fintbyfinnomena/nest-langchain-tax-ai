import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
    @IsNotEmpty()
    @IsString()
    user_text: string;
    ai_text: string;
    user_id: string;
}