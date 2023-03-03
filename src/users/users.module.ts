import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService, ProductsService, OrderService],
  exports: [UsersService],
})
export class UsersModule {}
