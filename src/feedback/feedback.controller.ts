import { Param, Controller, HttpCode, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly FeedbackService: FeedbackService) {}

  @Post('submit')
  @HttpCode(200)
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    console.log(createFeedbackDto);
    try {
      await this.FeedbackService.create(createFeedbackDto);
      return "Data saved"
    } catch (e: unknown) {
      return e;
    }

  }
}
