import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { FundInfoDto } from './dtos/fund-info.dto';
import { getFundInformation } from '../utils/tools/fundInfo.tools';

@Injectable()
export class FundService {
  async getFundInfo(fundInfoDto: FundInfoDto) {
    try {
      const response = await getFundInformation(fundInfoDto.fundName);
      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
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
