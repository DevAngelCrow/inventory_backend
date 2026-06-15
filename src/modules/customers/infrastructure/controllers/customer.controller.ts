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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';

import { CreateCustomerDto } from '../dtos/validators/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/validators/customer/update-customer.dto';
import { GetCustomersQueryDto } from '../dtos/query/get-customers-query.dto';
import { CustomerHttpDto } from '../dtos/http/customer-http.dto';

import { CreateCustomerCommand } from '../../application/commands/create-customer/create-customer.command';
import { UpdateCustomerCommand } from '../../application/commands/update-customer/update-customer.command';
import { DeleteCustomerCommand } from '../../application/commands/delete-customer/delete-customer.command';
import { GetCustomersQuery } from '../../application/queries/get-customers/get-customers.query';
import { GetCustomerQuery } from '../../application/queries/get-customer/get-customer.query';
import { CustomerDto } from '../../application/dtos/customer.dto';
import { Customer } from '../../domain/entities/customer';

@ApiTags('Customers')
@Controller()
@ApiBearerAuth('JWT-auth')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('crear-cliente')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCustomerDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateCustomerCommand(
      dto.first_name,
      dto.last_name,
      dto.phone,
      dto.email,
      dto.phone_secondary,
      dto.company_name,
      dto.tax_id,
      dto.address_line1,
      dto.address_line2,
      dto.city,
      dto.state,
      dto.zip_code,
      dto.notes,
      dto.id_user,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Customer created successfully',
    );
  }

  @Permissions('editar-cliente')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateCustomerCommand(
      id,
      dto.first_name,
      dto.last_name,
      dto.phone,
      dto.email,
      dto.phone_secondary,
      dto.company_name,
      dto.tax_id,
      dto.address_line1,
      dto.address_line2,
      dto.city,
      dto.state,
      dto.zip_code,
      dto.notes,
      dto.id_user,
    );
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Customer updated successfully',
    );
  }

  @Permissions('listar-clientes')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'filter_name', required: false, type: String })
  @ApiQuery({ name: 'filter_email', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(
    @Query() query: GetCustomersQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<CustomerHttpDto>>> {
    const appQuery = new GetCustomersQuery(
      query,
      query.filter_name,
      query.filter_email,
      query.status,
    );
    const result = await this.queryBus.execute<
      GetCustomersQuery,
      Pagination<CustomerDto> | CustomerDto[]
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : (result as CustomerDto[]);
    const totalItems = result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages = result instanceof Pagination ? result.getTotalPages() : 1;

    const httpDtos = items.map((c: CustomerDto) => CustomerHttpDto.fromDto(c));
    const response = new HttpPaginatedResponseDto<CustomerHttpDto>(
      httpDtos,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto(
      response,
      HttpStatus.OK,
      'Customers retrieved successfully',
    );
  }

  @Permissions('ver-cliente')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<CustomerHttpDto>> {
    const query = new GetCustomerQuery(id);
    const result: CustomerDto | null = await this.queryBus.execute(query);
    if (!result) {
      throw new NotFoundException('Customer', id);
    }
    return new SuccessResponseDto(
      CustomerHttpDto.fromDto(result),
      HttpStatus.OK,
      'Customer retrieved successfully',
    );
  }

  @Permissions('eliminar-cliente')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true, type: String })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteCustomerCommand(id);
    const result: Customer = await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      `Customer status updated to ${result.getActive() ? 'active' : 'inactive'}`,
    );
  }
}
