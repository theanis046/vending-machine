import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(createProfileDto: CreateProductDto, user: User):Promise<Product> {
    createProfileDto.user = user
    return this.productsRepository.save(
      this.productsRepository.create(createProfileDto),
    );
  }

  findOne(fields: EntityCondition<Product>) {
    return this.productsRepository.findOne({
      where: fields,
    });
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  update(id: number, updateProfileDto: CreateProductDto) {
    return this.productsRepository.save(
      this.productsRepository.create({
        id,
        ...updateProfileDto,
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.delete(id)
  }
}
