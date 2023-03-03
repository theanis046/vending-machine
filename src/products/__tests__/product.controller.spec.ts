import { Test } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import products from './fixtures/products.fixture';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import product from 'src/users/__tests__/fixtures/product.fixture';
import { User } from '../../users/entities/user.entity';

const moduleMocker = new ModuleMocker(global);

describe('Product Controller', () => {
  let productController: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
    })
      .useMocker((token) => {
        if (token === ProductsService) {
          return {
            findAll: jest.fn().mockResolvedValue(products),
            findOne: jest.fn().mockResolvedValue(
              Promise.resolve({
                id: 1,
                amountAvailable: 10,
                productName: 'Product1',
              }),
            ),
            create: jest.fn().mockResolvedValue(
              Promise.resolve({
                id: 1,
                amountAvailable: 10,
                cost: 1,
                productName: 'product1',
                user: new User(),
              }),
            ),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    productController = moduleRef.get(ProductsController);
  });

  describe('Find', () => {
    it('findAll should return an array of products', async () => {
      expect(await productController.findAll()).toBe(await products);
    });
    it('findOne should return firstProduct', async () => {
      expect(await productController.findOne('1')).toStrictEqual({
        id: 1,
        amountAvailable: 10,
        productName: 'Product1',
      });
    });
  });

  describe('Create', () => {
    it('create on service should be called', async () => {
      expect(
        await productController.create(
          {},
          {
            id: 1,
            amountAvailable: 10,
            productName: 'product1',
            cost: 1,
            user: new User(),
          },
        ),
      ).toStrictEqual({
        id: 1,
        amountAvailable: 10,
        cost: 1,
        productName: 'product1',
        user: new User(),
      });
    });
  });
});
