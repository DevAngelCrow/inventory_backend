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
import { PermissionsRequestDto } from '../dtos/validators/permissions/permissions.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { PermissionsHttpDto } from '../dtos/http/permissions-http-dto/permissions-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetPermissionsQueryDto } from '../dtos/query/get-permissions-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePermissionsCommand } from '../../application/permissions/commands/create-permissions/create-permissions.command';
import { UpdatePermissionsCommand } from '../../application/permissions/commands/update-permissions/update-permissions.command';
import { DeletePermissionsCommand } from '../../application/permissions/commands/delete-permissions/delete-permissions.command';
import { GetPermissionsQuery } from '../../application/permissions/queries/get-permissions/get-permissions.query';
import { GetPermissionsByIdQuery } from '../../application/permissions/queries/get-permissions-by-id/get-permissions-by-id.query';
import { Permissions } from '../decorators/permissions.decorator';
import { Auditable } from '@/modules/audit/infrastructure/decorators/auditable.decorator';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';

@Controller('permissions')
@ApiBearerAuth('JWT-auth')
export class PermissionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-permiso')
  @Auditable({
    action: AuditAction.PERMISSION_CREATED,
    entityType: 'Permission',
    entityIdFrom: 'body.name',
  })
  @Post()
  @HttpCode(201)
  async create(
    @Body() permissionsCreateRequest: PermissionsRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreatePermissionsCommand(permissionsCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Permissions created successfully',
    );
  }
  @Permissions('editar-permiso')
  @Auditable({
    action: AuditAction.PERMISSION_UPDATED,
    entityType: 'Permission',
    entityIdFrom: 'params.id',
  })
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() permissionsUpdateRequest: PermissionsRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdatePermissionsCommand({
      ...permissionsUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Permissions updated successfully',
    );
  }
  @Permissions('listar-permisos')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetPermissionsQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<PermissionsHttpDto>>> {
    const appQuery = new GetPermissionsQuery(
      query,
      query.name,
      query.active,
      query.category_permission_id,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((p: PermissionsHttpDto) =>
      PermissionsHttpDto.fromDto(p),
    );
    const response = new HttpPaginatedResponseDto<PermissionsHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<PermissionsHttpDto>>(
      response,
      HttpStatus.OK,
      'Permissions retrieved successfully',
    );
  }
  @Permissions('ver-permiso')
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<PermissionsHttpDto>> {
    const query = new GetPermissionsByIdQuery(id);
    const permissions: PermissionsHttpDto | null =
      await this.queryBus.execute(query);
    if (!permissions) {
      throw new NotFoundException('Permissions', id.toString());
    }
    const permissionsDtoHttp = PermissionsHttpDto.fromDto(permissions);
    return new SuccessResponseDto<PermissionsHttpDto>(
      permissionsDtoHttp,
      HttpStatus.OK,
      'Permissions retrieved successfully',
    );
  }
  @Permissions('eliminar-permiso')
  @Auditable({
    action: AuditAction.PERMISSION_STATUS_TOGGLED,
    entityType: 'Permission',
    entityIdFrom: 'params.id',
  })
  @Patch(':id')
  @HttpCode(200)
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeletePermissionsCommand(id);
    const permissions = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Permissions status was successfully updated to ${permissions.active ? 'active' : 'inactive'}`,
    );
  }
}
