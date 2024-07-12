import { Param, Controller, HttpCode, Get } from '@nestjs/common';
import { FundService } from './fund.service';

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Get('fund-info/:fundName')
  @HttpCode(200)
  async fundInfo(@Param('fundName') fundName: string) {
    return await this.fundService.getFundInfo(fundName);
  }
}
