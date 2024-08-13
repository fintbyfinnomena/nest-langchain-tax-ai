import {
  Headers,
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BatchOrderDto } from './dto/cutomer.dto';
import { CustomerService } from './customer.service';
import { ChatHeader } from 'src/langchain-chat/dtos/context-aware-messages.dto';
import { Response } from 'express';

@Controller('customer')
export class CustomerController {
  constructor(private readonly orderService: CustomerService) {}

  @Post('batch-order')
  async batchOrder(
    @Headers() headers: ChatHeader,
    @Body() batchPayload: BatchOrderDto,
    @Res() res: Response,
  ) {
    const userIdStr = headers['user-id'];

    if (!userIdStr) {
      throw new HttpException(
        'user-id header is missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    let userId: number;
    //convert user-id as string to number
    try {
      userId = parseInt(userIdStr);
    } catch (error) {
      throw new HttpException(
        'user-id header is not a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.orderService.GenerateBatchOrderPayload(
        userId,
        batchPayload,
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
