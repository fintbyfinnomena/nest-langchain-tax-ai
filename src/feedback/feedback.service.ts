import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from '../schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/creat-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private catModel: Model<Feedback>) {}

  async getFeedbackInfo(FeedbackName: string) {
    try {
      return "Hello World"
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async create(CreateFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = await this.catModel.create(CreateFeedbackDto);
    return createdFeedback.save();
  }

  private exceptionHandling = (e: unknown) => {
    Logger.error(e);
    throw new HttpException(
      customMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.EXTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
