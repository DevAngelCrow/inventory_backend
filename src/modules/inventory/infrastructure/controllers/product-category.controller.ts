import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';

import { CreateProductCategoryDto } from '../dtos/validators/product-category/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dtos/validators/product-category/update-product-category.dto';
import { GetProductCategoriesQueryDto } from '../dtos/query/get-product-categories-query.dto';
import { ProductCategoryHttpDto } from '../dtos/http/product-category-http.dto';

import { CreateProductCategoryCommand } from '../../application/product-category/commands/create-product-category/create-product-category.command';
import { UpdateProductCategoryCommand } from '../../application/product-category/commands/update-product-category/update-product-category.command';
import { DeleteProductCategoryCommand } from '../../application/product-category/commands/delete-product-category/delete-product-category.command';
import { GetProductCategoriesQuery } from '../../application/product-category/queries/get-product-categories/get-product-categories.query';
import { GetProductCategoryQuery } from '../../application/product-category/queries/get-product-category/get-product-category.query';
import { ProductCategoryDto } from '../../application/dtos/product-category.dto';
import { ProductCategory } from '../../domain/entities/product-category';

@Controller('categories')
@ApiBearerAuth('JWT-auth')
export class ProductCategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-categoria-producto')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProductCategoryDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateProductCategoryCommand(
      dto.name,
      dto.description,
      dto.icon,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Product category created successfully',
    );
  }

  @Permissions('editar-categoria-producto')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductCategoryDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateProductCategoryCommand(
      id,
      dto.name,
      dto.description,
      dto.icon,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Product category updated successfully',
    );
  }

  @Permissions('listar-categorias-producto')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_name', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(
    @Query() query: GetProductCategoriesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<ProductCategoryHttpDto>>> {
    const appQuery = new GetProductCategoriesQuery(
      query,
      query.filter_name,
      query.status,
    );
    const result = await this.queryBus.execute<
      GetProductCategoriesQuery,
      Pagination<ProductCategoryDto> | ProductCategoryDto[]
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : (result as ProductCategoryDto[]);
    const totalItems = result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages = result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: ProductCategoryDto) =>
      ProductCategoryHttpDto.fromDto(c),
    );
    const response = new HttpPaginatedResponseDto<ProductCategoryHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Product categories retrieved successfully',
    );
  }

  @Permissions('ver-categoria-producto')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<ProductCategoryHttpDto>> {
    const query = new GetProductCategoryQuery(id);
    const result: ProductCategoryDto | null = await this.queryBus.execute(query);
    if (!result) {
      throw new NotFoundException('ProductCategory', id);
    }
    return new SuccessResponseDto(
      ProductCategoryHttpDto.fromDto(result),
      HttpStatus.OK,
      'Product category retrieved successfully',
    );
  }

  @Permissions('eliminar-categoria-producto')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteProductCategoryCommand(id);
    const result: ProductCategory = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Product category status updated to ${result.getActive() ? 'active' : 'inactive'}`,
    );
  }
}
