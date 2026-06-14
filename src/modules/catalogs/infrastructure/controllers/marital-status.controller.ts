import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetMaritalStatusesQueryDto } from '../dtos/query/get-marital-statuses-query.dto';

import { MaritalStatusHttpDto } from '../dtos/http/marital-status-http-dto/marital-status-http.dto';
import { CreateMaritalStatusDto } from '../dtos/validators/marital-status/create-marital-status.dto';
import { UpdateMaritalStatusDto } from '../dtos/validators/marital-status/update-marital-status.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMaritalStatusCommand } from '../../application/marital-status/commands/create-marital-status/create-marital-status.command';
import { UpdateMaritalStatusCommand } from '../../application/marital-status/commands/update-marital-status/update-marital-status.command';
import { DeleteMaritalStatusCommand } from '../../application/marital-status/commands/delete-marital-status/delete-marital-status.command';
import { GetMaritalStatusesQuery } from '../../application/marital-status/queries/get-marital-statuses/get-marital-statuses.query';
import { GetMaritalStatusQuery } from '../../application/marital-status/queries/get-marital-status/get-marital-status.query';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
@Controller('marital-statuses')
@ApiBearerAuth('JWT-auth')
export class MaritalStatusController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-estado-civil')
  @Post()
  @HttpCode(201)
  async create(
    @Body() maritalStatusCreateRequest: CreateMaritalStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateMaritalStatusCommand(maritalStatusCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'MaritalStatus created successfully',
    );
  }
  @Permissions('editar-estado-civil')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() maritalStatusUpdateRequest: UpdateMaritalStatusDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateMaritalStatusCommand({
      ...maritalStatusUpdateRequest,
      id,
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'MaritalStatus updated successfully',
    );
  }
  @Permissions('listar-estados-civiles', 'ver-mi-perfil')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getAll(
    @Query() query: GetMaritalStatusesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<MaritalStatusHttpDto>>
  > {
    const appQuery = new GetMaritalStatusesQuery(query, query.filter);
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((m: MaritalStatusHttpDto) =>
      MaritalStatusHttpDto.fromDto(m),
    );
    const response = new HttpPaginatedResponseDto<MaritalStatusHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<MaritalStatusHttpDto>
    >(response, HttpStatus.OK, 'MaritalStatuses retrieved successfully');
  }
  @Permissions('ver-estado-civil')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<MaritalStatusHttpDto>> {
    const query = new GetMaritalStatusQuery(id);
    const maritalStatus: MaritalStatusHttpDto =
      await this.queryBus.execute(query);
    if (!maritalStatus) {
      throw new NotFoundException('MaritalStatus', id.toString());
    }
    const maritalStatusDtoHttp = MaritalStatusHttpDto.fromDto(maritalStatus);
    return new SuccessResponseDto<MaritalStatusHttpDto>(
      maritalStatusDtoHttp,
      HttpStatus.OK,
      'MaritalStatus retrieved successfully',
    );
  }
  @Permissions('eliminar-estado-civil')
  @Delete(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteMaritalStatusCommand(id);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'MaritalStatus status updated successfully',
    );
  }
}
