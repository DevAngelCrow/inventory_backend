import { Test, TestingModule } from '@nestjs/testing';
import { GetProductCategoriesHandler } from './get-product-categories.handler';
import { ProductCategoryQueriesRepository } from '@/modules/inventory/application/repositories/product-category-read.repository';
import { GetProductCategoriesQuery } from './get-product-categories.query';
import { ProductCategoryDto } from '@/modules/inventory/application/dtos/product-category.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';

describe('GetProductCategoriesHandler', () => {
  let handler: GetProductCategoriesHandler;
  let repository: jest.Mocked<ProductCategoryQueriesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductCategoriesHandler,
        {
          provide: ProductCategoryQueriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetProductCategoriesHandler>(
      GetProductCategoriesHandler,
    );
    repository = module.get(ProductCategoryQueriesRepository);
  });

  it('should return an array of categories without pagination', async () => {
    const query = new GetProductCategoriesQuery();
    const categories: ProductCategoryDto[] = [
      new ProductCategoryDto('Cat 1', 'Desc 1', 'icon', true, '1'),
    ];

    repository.getAll.mockResolvedValue(categories);

    const result = await handler.execute(query);

    expect(result).toEqual(categories);
    expect(repository.getAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
  });

  it('should return paginated categories', async () => {
    const query = new GetProductCategoriesQuery({ page: 1, per_page: 10 });

    const categories: ProductCategoryDto[] = [
      new ProductCategoryDto('Cat 1', 'Desc 1', 'icon', true, '1'),
    ];

    const paginationResult = new Pagination<ProductCategoryDto>(
      new EntityList(categories),
      PaginationParams.create({ page: 1, per_page: 10 }).getPage(),
      PaginationParams.create({ page: 1, per_page: 10 }).getPerPage(),
      new TotalItems(1),
      new TotalPages(1),
    );

    repository.getAll.mockResolvedValue(paginationResult);

    const result = await handler.execute(query);

    expect(result).toBeInstanceOf(Pagination);
    expect((result as Pagination<ProductCategoryDto>).getEntityList()).toEqual(
      categories,
    );
    expect(repository.getAll).toHaveBeenCalledTimes(1);

    const callArgs = repository.getAll.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(PaginationParams);
  });
});
