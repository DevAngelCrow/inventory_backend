import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductCategoryHandler } from './create-product-category.handler';
import { ProductCategoryRepository } from '@/modules/inventory/domain/repositories/product-category-repository';
import { CreateProductCategoryCommand } from './create-product-category.command';
import { ProductCategory } from '@/modules/inventory/domain/entities/product-category';

describe('CreateProductCategoryHandler', () => {
  let handler: CreateProductCategoryHandler;
  let repository: jest.Mocked<ProductCategoryRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductCategoryHandler,
        {
          provide: ProductCategoryRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateProductCategoryHandler>(
      CreateProductCategoryHandler,
    );
    repository = module.get(ProductCategoryRepository);
  });

  it('should successfully create a product category', async () => {
    const command = new CreateProductCategoryCommand(
      'Electronics',
      'Electronic devices',
      'icon-tv',
    );

    repository.create.mockResolvedValue();

    await handler.execute(command);

    expect(repository.create).toHaveBeenCalledTimes(1);

    const createdCategory = repository.create.mock.calls[0][0];
    expect(createdCategory.getName().value()).toBe('Electronics');
    expect(createdCategory.getDescription()?.value()).toBe(
      'Electronic devices',
    );
    expect(createdCategory.getIcon()).toBe('icon-tv');
    expect(createdCategory.getActive()).toBe(true);
  });

  it('should propagate errors thrown by the repository', async () => {
    const command = new CreateProductCategoryCommand('Electronics');

    repository.create.mockRejectedValue(new Error('DB Connection Error'));

    await expect(handler.execute(command)).rejects.toThrow(
      'DB Connection Error',
    );
  });
});
