import {
  Headers,
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { BatchOrderDto } from './dto/cutomer.dto';
import { CustomerService } from './customer.service';
import { ChatHeader } from 'src/langchain-chat/dtos/context-aware-messages.dto';
import { Response } from 'express';
import type { AppError } from 'src/utils/responses/appError';

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
      const body: AppError = {
        status_code: HttpStatus.BAD_REQUEST,
        error_code: '00',
        message: 'ต้องการ header user-id',
      };
      return res.status(HttpStatus.BAD_REQUEST).json(body);
    }

    let userId: number;
    //convert user-id as string to number
    try {
      userId = parseInt(userIdStr);
    } catch (error) {
      const body: AppError = {
        status_code: HttpStatus.BAD_REQUEST,
        error_code: '00',
        message: 'user-id header ต้องเป็นตัวเลข',
      };
      return res.status(HttpStatus.BAD_REQUEST).json(body);
    }

    try {
      const response = await this.orderService.GenerateBatchOrderPayload(
        userId,
        batchPayload,
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const body: AppError = {
        status_code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error_code: getErrorCodeFromErrorMessage(error.message),
        message: error.message,
      };

      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(body);
    }
  }
}

// TODO: find the way of appExceptionHandlerLater
function getErrorCodeFromErrorMessage(message: string): string {
  if (message === 'ไม่พบบัญชี segregate ของผู้ใช้') {
    return '01';
  } else if (message === 'ไม่พบบัญชีธนาคารของผู้ใช้') {
    return '02';
  } else {
    return '00';
  }
}
