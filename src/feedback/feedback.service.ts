import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from '../schemas/feedback.schema';
import { FeedbackDto } from './dto/feedback.dto';


@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private FeedbackModel: Model<string>) {}

  async create(CreateFeedbackDto: FeedbackDto) {
    const createdFeedback = await this.FeedbackModel.create(CreateFeedbackDto);
    await createdFeedback.save();
    return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, "Data Saved");
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
