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
import { RolRequestDto } from '../dtos/validators/rol/rol.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { RolHttpDto } from '../dtos/http/rol-http-dto/rol-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetRolesQueryDto } from '../dtos/query/get-roles-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRolCommand } from '../../application/rol/commands/create-rol/create-rol.command';
import { UpdateRolCommand } from '../../application/rol/commands/update-rol/update-rol.command';
import { DeleteRolCommand } from '../../application/rol/commands/delete-rol/delete-rol.command';
import { GetRolesQuery } from '../../application/rol/queries/get-roles/get-roles.query';
import { GetRolByIdQuery } from '../../application/rol/queries/get-rol-by-id/get-rol-by-id.query';
import { Permissions } from '../decorators/permissions.decorator';
import { MultipleStatusId } from '@/shared/domain/enums/multiple-status';
import { Auditable } from '@/modules/audit/infrastructure/decorators/auditable.decorator';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';

@Controller('role')
@ApiBearerAuth('JWT-auth')
export class RolController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-rol')
  @Auditable({
    action: AuditAction.ROLE_CREATED,
    entityType: 'Role',
    entityIdFrom: 'body.code',
  })
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() rolCreateRequest: RolRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateRolCommand(rolCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Rol created successfully',
    );
  }
  @Permissions('editar-rol')
  @Auditable({
    action: AuditAction.ROLE_UPDATED,
    entityType: 'Role',
    entityIdFrom: 'params.id',
  })
  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rolUpdateRequest: RolRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateRolCommand({ ...rolUpdateRequest, id });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Rol updated successfully',
    );
  }
  @Permissions('listar-roles')
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List roles with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated role list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAll(
    @Query() query: GetRolesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<RolHttpDto>>> {
    const appQuery = new GetRolesQuery(query, query.name, query.id_status);
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((r: RolHttpDto) => RolHttpDto.fromDto(r));
    const response = new HttpPaginatedResponseDto<RolHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<RolHttpDto>>(
      response,
      HttpStatus.OK,
      'Rols retrieved successfully',
    );
  }
  @Permissions('ver-rol')
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role found', type: RolHttpDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<RolHttpDto>> {
    const query = new GetRolByIdQuery(id);
    const rol = await this.queryBus.execute<
      GetRolByIdQuery,
      RolHttpDto<unknown, unknown> | null
    >(query);
    if (!rol) {
      throw new NotFoundException('Rol', id.toString());
    }
    const rolDtoHttp: RolHttpDto = RolHttpDto.fromDto(rol);
    return new SuccessResponseDto<RolHttpDto>(
      rolDtoHttp,
      HttpStatus.OK,
      'Rol retrieved successfully',
    );
  }
  @Permissions('eliminar-rol')
  @Auditable({
    action: AuditAction.ROLE_STATUS_TOGGLED,
    entityType: 'Role',
    entityIdFrom: 'params.id',
  })
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Toggle role active/inactive status' })
  @ApiResponse({ status: 200, description: 'Role status toggled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteRolCommand(id);
    const rol = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Rol status was successfully updated to ${rol.id_status === MultipleStatusId.ACTIVE ? 'active' : 'inactive'}`,
    );
  }
}
