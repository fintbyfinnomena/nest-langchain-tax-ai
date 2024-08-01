/**
 * Data Transfer Object for basic message processing.
 *
 * This class defines the data structure and validation rules for handling a basic
 * user query. It utilizes decorators from the 'class-validator' library to enforce
 * validation constraints on the data received from client requests. This ensures
 * that the user query adheres to the expected format and content requirements.
 *
 * @class BasicMessageDto
 *
 * @property user_query - The query string provided by the user.
 *                        It must be a non-empty string.
 */
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BasicMessageDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class ThumbDownBody {
  @IsInt()
  @Min(0)
  index: number;
}
