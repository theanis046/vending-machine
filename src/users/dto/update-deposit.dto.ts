import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, Validate } from 'class-validator';

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(amount: number, validationArguments: ValidationArguments) {
    const aaa =  validationArguments.constraints.indexOf(amount)>-1;
    return aaa
  }
}

export class UpdateDepositDto {
  @Validate(CustomTextLength, [5, 10, 20, 50, 100], {
    message: 'can only deposit using coins  5, 10, 20, 50, 100',
  })
  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
