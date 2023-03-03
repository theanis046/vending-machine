import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { User } from '../../users/entities/user.entity';

export class CreateProductDto {

  id: number;

  @ApiProperty({example: 1})
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  amountAvailable: number;

  @ApiProperty({example: 1})
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  cost: number | 0;

  @ApiProperty({example: 'coke'})
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  productName: string;



  @ApiProperty({ type: User })
  @Validate(IsExist, ['User', 'id'], {
    message: 'userNotExists',
  })
  user?: User | null;
}


