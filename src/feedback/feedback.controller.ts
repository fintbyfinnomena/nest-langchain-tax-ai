import { Param, Controller, HttpCode, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly FeedbackService: FeedbackService) {}

  @Post('submit')
  @HttpCode(200)
  async create(@Body() createFeedbackDto: FeedbackDto) {
    try {
      return await this.FeedbackService.create(createFeedbackDto);
    } catch (e: unknown) {
      return e;
    }

  }
}
