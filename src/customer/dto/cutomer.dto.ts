import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class BatchOrderDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  orders: OrderDto[];
}

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  fund_short_code: string;

  @IsInt()
  @Min(0)
  amount: number;
}
