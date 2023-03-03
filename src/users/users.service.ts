import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { BaseEntity, DataSource, Repository } from 'typeorm';
import { PurchaseDto } from './dto/buy-product.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  create(createProfileDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );
  }


  findOne(fields: EntityCondition<User>) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  update(id: number, updateProfileDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...updateProfileDto,
      }),
    );
  }

  // async deposit(deposit: UpdateDepositDto, userSession: User) {
  //   const user = await this.usersRepository.findOne({
  //     where: {
  //       id: userSession.id,
  //     },
  //   });

  //   user.deposit = user.deposit + deposit.amount;
  //   const result = await this.usersRepository.save(
  //     this.usersRepository.create({
  //       id: userSession.id,
  //       ...user,
  //     }),
  //   );

  //   return result;
  // }

  // async buy(purchase: PurchaseDto, userSession: User) {
  //   const [user, product] = await this.GetUserAndProduct(userSession, purchase);

  //   this.checkAvailableProductQuantity(purchase, product);

  //   this.updateProductQuantity(product, purchase);

  //   const productSaved = this.productRepository.save(
  //     this.productRepository.create(product),
  //   );

  //   user.deposit = this.updateUserDeposit(user, purchase, product);

  //   const userSaved = this.usersRepository.save(
  //     this.usersRepository.create(user
  //     //   {
  //     //   id: userSession.id,
  //     //   ...user,
  //     //   // deposit: this.updateUserDeposit(user, purchase, product),
  //     // }
  //     ),
  //   );
  //   await this.updatePurchaseDetails(productSaved, userSaved);
  // }

  // private updateUserDeposit(
  //   user: User,
  //   purchase: PurchaseDto,
  //   product: Product,
  // ): number {
  //   return user.deposit - purchase.amount * product.cost;
  // }

  // private updateProductQuantity(product: Product, purchase: PurchaseDto) {
  //   product.amountAvailable = product.amountAvailable - purchase.amount;
  // }

  // private checkAvailableProductQuantity(
  //   purchase: PurchaseDto,
  //   product: Product,
  // ) {
  //   if (purchase.amount > product.amountAvailable) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         errors: {
  //           cost: 'not enough amount available for product',
  //         },
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // private async GetUserAndProduct(
  //   userSession: User,
  //   purchase: PurchaseDto,
  // ): Promise<[User, Product]> {
  //   return await Promise.all([
  //     this.usersRepository.findOne({
  //       where: {
  //         id: userSession.id,
  //       },
  //     }),

  //     this.productRepository.findOne({
  //       where: {
  //         id: purchase.productId,
  //       },
  //     }),
  //   ]);
  // }

  async softDelete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async reset(userSession: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userSession.id,
      },
    });

    return await this.usersRepository.save(
      this.usersRepository.create({
        ...user,
        deposit: 0,
      }),
    );
  }

  // public async updatePurchaseDetails(...args: Promise<BaseEntity>[]) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     await Promise.all([args]);
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     // since we have errors lets rollback the changes we made
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
