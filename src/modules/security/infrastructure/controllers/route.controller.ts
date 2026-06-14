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
import { RouteRequestDto } from '../dtos/validators/route/route.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { RouteHttpDto } from '../dtos/http/route-http-dto/route-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetRoutesQueryDto } from '../dtos/query/get-routes-query.dto';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRouteCommand } from '../../application/route/commands/create-route/create-route.command';
import { UpdateRouteCommand } from '../../application/route/commands/update-route/update-route.command';
import { DeleteRouteCommand } from '../../application/route/commands/delete-route/delete-route.command';
import { GetRoutesQuery } from '../../application/route/queries/get-routes/get-routes.query';
import { GetRouteByIdQuery } from '../../application/route/queries/get-route-by-id/get-route-by-id.query';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('routes')
@ApiBearerAuth('JWT-auth')
export class RouteController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-ruta')
  @Post()
  @HttpCode(201)
  async create(
    @Body() routeCreateRequest: RouteRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateRouteCommand(routeCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Route created successfully',
    );
  }
  @Permissions('editar-ruta')
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() routeUpdateRequest: RouteRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateRouteCommand({ ...routeUpdateRequest, id });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Route updated successfully',
    );
  }
  @Permissions('listar-rutas')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetRoutesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<RouteHttpDto>>> {
    const appQuery = new GetRoutesQuery(
      query,
      query.name,
      query.active,
      query.id_parent,
    );
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((r: RouteHttpDto) =>
      RouteHttpDto.fromDto({ ...r }),
    );
    const response = new HttpPaginatedResponseDto<RouteHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<RouteHttpDto>>(
      response,
      HttpStatus.OK,
      'Routes retrieved successfully',
    );
  }
  @Permissions('ver-ruta')
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<RouteHttpDto>> {
    const query = new GetRouteByIdQuery(id);
    const route: RouteHttpDto = await this.queryBus.execute(query);
    if (!route) {
      throw new NotFoundException('Route', id.toString());
    }
    const routeDtoHttp = RouteHttpDto.fromDto(route);
    return new SuccessResponseDto<RouteHttpDto>(
      routeDtoHttp,
      HttpStatus.OK,
      'Route retrieved successfully',
    );
  }
  @Permissions('eliminar-ruta')
  @Patch(':id')
  @HttpCode(200)
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteRouteCommand(id);
    const route = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Route status was successfully updated to ${route.active ? 'active' : 'inactive'}`,
    );
  }
}
