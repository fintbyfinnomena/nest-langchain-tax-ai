import { IsNotEmpty, IsString } from 'class-validator';

export class FundInfoDto {
  @IsNotEmpty()
  @IsString()
  fundName: string;
}
