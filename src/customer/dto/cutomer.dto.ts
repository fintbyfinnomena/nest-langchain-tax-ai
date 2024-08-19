import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BatchOrderDto {
  @IsNotEmpty()
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
