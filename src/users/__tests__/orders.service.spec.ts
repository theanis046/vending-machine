import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

import { DataSource, Repository } from 'typeorm';
import product from './fixtures/product.fixture';
import user from './fixtures/user.fixture';
import { HttpException } from '@nestjs/common';
import { OrderService } from '../order.service';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: {
        getRepository: jest.fn().mockImplementation(() => ({
          create: jest.fn(),
          findOne: jest.fn(() => {
            return {};
          }),
        })),
        save: jest.fn(),
      },
    })),
  }),
);

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  }),
);

describe(' Test suite', () => {
  let userService: UsersService;
  let orderService: OrderService;
  let productRepository: MockType<Repository<Product>>;
  let userRepository: MockType<Repository<User>>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        OrderService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
        { provide: DataSource, useFactory: dataSourceMockFactory },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    orderService = module.get<OrderService>(OrderService);
    productRepository = module.get(getRepositoryToken(Product));
    userRepository = module.get(getRepositoryToken(User));
    dataSource = module.get(DataSource);

    productRepository.findOne.mockReturnValue(product);
    productRepository.create = jest.fn();
    productRepository.save = jest.fn();

    userRepository.findOne.mockReturnValue(user);
    userRepository.create = jest.fn();
    userRepository.save = jest.fn();
  });
  describe('Buy', () => {
    it('transaction methods should be called', async () => {
      jest.spyOn(orderService, 'updatePurchaseDetails');
      const queryRunner = jest.spyOn(dataSource, 'createQueryRunner');

      await orderService.buy(
        {
          productId: 1,
          amount: 5,
        },
        user,
      );
      expect(dataSource.createQueryRunner).toBeCalledTimes(1);
      expect(orderService.updatePurchaseDetails).toBeCalledTimes(1);
      expect(queryRunner).toBeCalledTimes(1);
      expect(product.amountAvailable).toEqual(10);
    });

    it('amount available should update after purchase', async () => {
      await orderService.buy(
        {
          productId: 1,
          amount: 5,
        },
        user,
      );
      expect(product.amountAvailable).toEqual(5);
    });

    it('should not be able to purchase more then available quantity', async () => {
      try {
        await orderService.buy(
          {
            productId: 1,
            amount: 15,
          },
          user,
        );
      } catch (err) {
        expect(err).toHaveProperty('status', 400);
      }
    });
  });

  describe('Deposit', () => {
    it('repository save method should be called', async () => {
      await orderService.deposit(
        {
          amount: 5,
        },
        user,
      );

      expect(userRepository.save).toBeCalledTimes(1);
      expect(userRepository.create).toBeCalled()
    });
    it('user deposit should increment by 5', async () => {
      await orderService.deposit(
        {
          amount: 5,
        },
        user,
      );

      expect(user.deposit).toEqual(10);
    });
  });
});
