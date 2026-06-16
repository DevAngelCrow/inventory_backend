import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductHandler } from './create-product.handler';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { CreateProductCommand } from './create-product.command';
import { Product } from '@/modules/inventory/domain/entities/product';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: ProductRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
    repository = module.get(ProductRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.create with correct product entity', async () => {
    const command = new CreateProductCommand(
      'SKU-123',
      'Test Product',
      10.5,
      50,
      '123e4567-e89b-12d3-a456-426614174000',
      'A test product description',
      100,
      10,
    );

    await handler.execute(command);

    expect(repository.create).toHaveBeenCalledTimes(1);
    const createdProduct = repository.create.mock.calls[0][0] as Product;
    expect(createdProduct.getSku().value()).toBe('SKU-123');
    expect(createdProduct.getName().value()).toBe('Test Product');
    expect(createdProduct.getRentalPrice().value()).toBe(10.5);
    expect(createdProduct.getReplacementCost()?.value()).toBe(100);
    expect(createdProduct.getTotalStock().value()).toBe(50);
    expect(createdProduct.getMinStockAlert().value()).toBe(10);
    expect(createdProduct.getCategoryId().value()).toBe('123e4567-e89b-12d3-a456-426614174000');
  });
});
