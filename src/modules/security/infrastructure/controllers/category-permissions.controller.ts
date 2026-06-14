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
import { CategoryPermissionsRequestDto } from '../dtos/validators/category-permissions/category-permissions.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { CategoryPermissionsHttpDto } from '../dtos/http/category-permissions-http-dto/category-permissions-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCategoryPermissionsQueryDto } from '../dtos/query/get-category-permissions-query.dto';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryPermissionsCommand } from '../../application/category-permissions/commands/create-category-permissions/create-category-permissions.command';
import { UpdateCategoryPermissionsCommand } from '../../application/category-permissions/commands/update-category-permissions/update-category-permissions.command';
import { DeleteCategoryPermissionsCommand } from '../../application/category-permissions/commands/delete-category-permissions/delete-category-permissions.command';
import { GetCategoryPermissionsQuery } from '../../application/category-permissions/queries/get-category-permissions/get-category-permissions.query';
import { GetCategoryPermissionsByIdQuery } from '../../application/category-permissions/queries/get-category-permissions-by-id/get-category-permissions-by-id.query';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('category-permissions')
@ApiBearerAuth('JWT-auth')
export class CategoryPermissionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-categoria-permiso')
  @Post()
  @HttpCode(201)
  async create(
    @Body() categoryPermissionsCreateRequest: CategoryPermissionsRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateCategoryPermissionsCommand(
      categoryPermissionsCreateRequest,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Category-permissions created successfully',
    );
  }
  @Permissions('editar-categoria-permisos')
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryPermissionsUpdateRequest: CategoryPermissionsRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateCategoryPermissionsCommand({
      ...categoryPermissionsUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Category-permissions updated successfully',
    );
  }
  @Permissions('listar-categorias-permisos')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetCategoryPermissionsQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<CategoryPermissionsHttpDto>>
  > {
    const appQuery = new GetCategoryPermissionsQuery(
      query,
      query.name,
      query.active,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((c: CategoryPermissionsHttpDto) =>
      CategoryPermissionsHttpDto.fromDto(c),
    );
    const response = new HttpPaginatedResponseDto<CategoryPermissionsHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<CategoryPermissionsHttpDto>
    >(response, HttpStatus.OK, 'Category-permissions retrieved successfully');
  }
  @Permissions('ver-categoria-permiso')
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<CategoryPermissionsHttpDto>> {
    const query = new GetCategoryPermissionsByIdQuery(id);
    const categoryPermissions: CategoryPermissionsHttpDto =
      await this.queryBus.execute(query);
    if (!categoryPermissions) {
      throw new NotFoundException('Category-permissions', id.toString());
    }
    const categoryPermissionsDtoHttp =
      CategoryPermissionsHttpDto.fromDto(categoryPermissions);
    return new SuccessResponseDto<CategoryPermissionsHttpDto>(
      categoryPermissionsDtoHttp,
      HttpStatus.OK,
      'Category-permissions retrieved successfully',
    );
  }
  @Permissions('eliminar-categoria-permiso')
  @Patch(':id')
  @HttpCode(200)
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteCategoryPermissionsCommand(id);
    const categoryPermissions = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Category-permissions status was successfully updated to ${categoryPermissions.active ? 'active' : 'inactive'}`,
    );
  }
}
