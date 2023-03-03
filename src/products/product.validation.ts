import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductValidationPipe implements PipeTransform {
  transform(product: CreateProductDto, metadata: ArgumentMetadata) {
    if (product && product.cost % 5 != 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            cost: 'cost should be in multiple of 5',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return product;
  }
}
