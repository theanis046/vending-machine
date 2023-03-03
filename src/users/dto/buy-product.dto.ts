import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPositive,
} from 'class-validator';


export class PurchaseDto {
  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsPositive()
  amount: number;

}
