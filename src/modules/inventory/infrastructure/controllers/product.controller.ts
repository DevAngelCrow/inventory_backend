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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

import { CreateProductDto } from '../dtos/validators/product/create-product.dto';
import { UpdateProductDto } from '../dtos/validators/product/update-product.dto';
import { GetProductsQueryDto } from '../dtos/query/get-products-query.dto';
import { ProductHttpDto } from '../dtos/http/product-http.dto';

import { CreateProductCommand } from '../../application/product/commands/create-product/create-product.command';
import { UpdateProductCommand } from '../../application/product/commands/update-product/update-product.command';
import { DeleteProductCommand } from '../../application/product/commands/delete-product/delete-product.command';
import { GetProductsQuery } from '../../application/product/queries/get-products/get-products.query';
import { GetProductQuery } from '../../application/product/queries/get-product/get-product.query';
import { ProductDto } from '../../application/dtos/product.dto';
import { Product } from '../../domain/entities/product';

import { ConfigService } from '@nestjs/config';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth('JWT-auth')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Permissions('crear-producto')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_file'))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image_file?: Express.Multer.File,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateProductCommand(
      dto.sku,
      dto.name,
      dto.rental_price,
      dto.total_stock,
      dto.category_id,
      dto.description,
      dto.replacement_cost,
      dto.min_stock_alert,
      dto.color,
      dto.dimensions,
      dto.weight_lbs,
      dto.image_url,
      dto.notes,
      image_file,
      this.configService.get<string>('PROVIDER_STORAGE_CODE') ?? 'LOCAL',
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Product created successfully',
    );
  }

  @Permissions('editar-producto')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_file'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image_file?: Express.Multer.File,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateProductCommand(
      id,
      dto.sku,
      dto.name,
      dto.rental_price,
      dto.total_stock,
      dto.category_id,
      dto.description,
      dto.replacement_cost,
      dto.min_stock_alert,
      dto.color,
      dto.dimensions,
      dto.weight_lbs,
      dto.image_url,
      dto.notes,
      image_file,
      this.configService.get<string>('PROVIDER_STORAGE_CODE') ?? 'LOCAL',
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Product updated successfully',
    );
  }

  @Permissions('listar-productos')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_name', required: false, type: String })
  @ApiQuery({ name: 'filter_sku', required: false, type: String })
  @ApiQuery({ name: 'filter_category', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(
    @Query() query: GetProductsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<ProductHttpDto>>> {
    const appQuery = new GetProductsQuery(
      query,
      query.filter_name,
      query.filter_sku,
      query.filter_category,
      query.active,
    );
    const result = await this.queryBus.execute<
      GetProductsQuery,
      Pagination<ProductDto> | ProductDto[]
    >(appQuery);

    const items =
      result instanceof Pagination ? result.getEntityList() : result;
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: ProductDto) => ProductHttpDto.fromDto(c));
    const response = new HttpPaginatedResponseDto<ProductHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Products retrieved successfully',
    );
  }

  @Permissions('ver-producto')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<ProductHttpDto>> {
    const query = new GetProductQuery(id);
    const result: ProductDto | null = await this.queryBus.execute(query);
    if (!result) {
      throw new NotFoundException('Product', id);
    }
    return new SuccessResponseDto(
      ProductHttpDto.fromDto(result),
      HttpStatus.OK,
      'Product retrieved successfully',
    );
  }

  @Permissions('eliminar-producto')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteProductCommand(id);
    const result: Product = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Product status updated to ${result.getActive() ? 'active' : 'inactive'}`,
    );
  }
}
