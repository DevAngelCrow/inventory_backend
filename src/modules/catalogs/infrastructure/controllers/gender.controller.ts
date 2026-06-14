import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetGendersQueryDto } from '../dtos/query/get-genders-query.dto';

import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GenderHttpDto } from '../dtos/http/gender-http-dto/gender-http.dto';
import { GetGendersQuery } from '../../application/gender/queries/get-genders/get-genders.query';
import { GenderDto } from '../../application/dtos/gender.dto';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';

@Controller('genders')
@ApiBearerAuth('JWT-auth')
export class GenderController {
  constructor(private readonly queryBus: QueryBus) {}
  @Permissions('listar-generos', 'ver-mi-perfil')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getAll(
    @Query() query: GetGendersQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<GenderHttpDto>>> {
    const appQuery = new GetGendersQuery(query, query.filter);
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const gendersHttpDto = items.map((gender: GenderDto) =>
      GenderHttpDto.fromDto({ ...gender }),
    );
    const response = new HttpPaginatedResponseDto<GenderHttpDto>(
      gendersHttpDto,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<GenderHttpDto>>(
      response,
      HttpStatus.OK,
      'Genders retrieved successfully',
    );
  }
}
