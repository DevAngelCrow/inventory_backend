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
import { CreateCountryDto } from '../dtos/validators/country/create-country.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { UpdateCountryDto } from '../dtos/validators/country/update-country.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { CountryHttpDto } from '../dtos/http/country-http-dto/country-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetCountriesQueryDto } from '../dtos/query/get-countries-query.dto';

import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateCountryCommand } from '../../application/country/commands/create-country/create-country.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCountryCommand } from '../../application/country/commands/update-country/update-country.command';
import { GetCountriesQuery } from '../../application/country/queries/get-countries/get-countries.query';
import { GetCountryQuery } from '../../application/country/queries/get-country/get-country.query';
import { DeleteCountryCommand } from '../../application/country/commands/delete-country/delete-country.command';
import { CountryDto } from '../../application/dtos/country.dto';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';

@Controller('countries')
@ApiBearerAuth('JWT-auth')
export class CountryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-pais')
  @Post()
  @HttpCode(201)
  async create(
    @Body() countryCreateRequest: CreateCountryDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateCountryCommand(countryCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Country created successfully',
    );
  }
  @Permissions('editar-pais')
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() countryUpdateRequest: UpdateCountryDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateCountryCommand({ id, ...countryUpdateRequest });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Country updated successfully',
    );
  }
  @Permissions('listar-paises', 'ver-mi-perfil')
  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_name', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(
    @Query() query: GetCountriesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<CountryHttpDto>>> {
    const appQuery = new GetCountriesQuery(
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

    const countriesHttpDto = items.map((c: CountryHttpDto) =>
      CountryHttpDto.fromDto(c),
    );
    const response = new HttpPaginatedResponseDto<CountryHttpDto>(
      countriesHttpDto,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<CountryHttpDto>>(
      response,
      HttpStatus.OK,
      'Countries retrieved successfully',
    );
  }
  @Permissions('ver-pais')
  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<CountryHttpDto>> {
    const query = new GetCountryQuery(id);
    const country: CountryDto = await this.queryBus.execute(query);
    if (!country) {
      throw new NotFoundException('Country', id.toString());
    }
    const countryDtoHttp = CountryHttpDto.fromDto(country);
    return new SuccessResponseDto<CountryHttpDto>(
      countryDtoHttp,
      HttpStatus.OK,
      'Country retrieved successfully',
    );
  }
  @Permissions('eliminar-pais')
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', required: true, type: Number })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteCountryCommand(id);
    const country = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Country status was successfully updated to ${country.active ? 'active' : 'inactive'}`,
    );
  }
}
