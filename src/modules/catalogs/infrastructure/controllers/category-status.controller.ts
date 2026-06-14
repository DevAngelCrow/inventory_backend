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
import { CreateCategoryStatusDto } from '../dtos/validators/category-status/create-category-status.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { UpdateCategoryStatusDto } from '../dtos/validators/category-status/update-category-status.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { CategoryStatusHttpDto } from '../dtos/http/category-status-http-dto/category-status-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCategoryStatusesQueryDto } from '../dtos/query/get-category-statuses-query.dto';

import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateCategoryStatusCommand } from '../../application/category-status/commands/create-category-status/create-category-status.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCategoryStatusCommand } from '../../application/category-status/commands/update-category-status/update-category-status.command';
import { GetCategoriesStatusQuery } from '../../application/category-status/queries/get-categories-status/get-categories-status.query';
import { GetCategoryStatusQuery } from '../../application/category-status/queries/get-category-status/get-category-status.query';
import { DeleteCategoryStatusCommand } from '../../application/category-status/commands/delete-category-status/delete-category-status.command';
import { CategoryStatusDto } from '../../application/dtos/category-status.dto';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';

@Controller('categories-status')
@ApiBearerAuth('JWT-auth')
export class CategoryStatusController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-categoria-estado')
  @Post()
  @HttpCode(201)
  async create(
    @Body() categoryStatusCreateRequest: CreateCategoryStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateCategoryStatusCommand(
      categoryStatusCreateRequest,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Category Status created successfully',
    );
  }
  @Permissions('editar-categoria-estado')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryStatusUpdateRequest: UpdateCategoryStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateCategoryStatusCommand({
      ...categoryStatusUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Category Status updated successfully',
    );
  }
  @Permissions('listar-categorias-estados')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async getAll(
    @Query() query: GetCategoryStatusesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<CategoryStatusHttpDto>>
  > {
    const appQuery = new GetCategoriesStatusQuery(
      query,
      query.filter_name,
      query.status,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((c: CategoryStatusDto) =>
      CategoryStatusHttpDto.fromDto({ ...c }),
    );
    const response = new HttpPaginatedResponseDto<CategoryStatusHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<CategoryStatusHttpDto>
    >(response, HttpStatus.OK, 'Categories Status retrieved successfully');
  }
  @Permissions('ver-categoria-estado')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<CategoryStatusHttpDto>> {
    const query = new GetCategoryStatusQuery(id);
    const categoryStatus: CategoryStatusDto =
      await this.queryBus.execute(query);
    if (!categoryStatus) {
      throw new NotFoundException('CategoryStatus', id.toString());
    }
    const categoryStatusDtoHttp = CategoryStatusHttpDto.fromDto(categoryStatus);
    return new SuccessResponseDto<CategoryStatusHttpDto>(
      categoryStatusDtoHttp,
      HttpStatus.OK,
      'Category Status retrieved successfully',
    );
  }
  @Permissions('eliminar-categoria-estado')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteCategoryStatusCommand(id);
    const categoryStatus = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Category Status was successfully updated to ${categoryStatus.active ? 'active' : 'inactive'}`,
    );
  }
}
