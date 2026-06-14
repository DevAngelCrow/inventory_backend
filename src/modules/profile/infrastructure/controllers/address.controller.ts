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
  UseGuards,
} from '@nestjs/common';
import { AddressDto } from '../dtos/validators/address/addres.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { AddressHttpDto } from '../dtos/http/address-http-dto/address-http.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetAddressesQueryDto } from '../dtos/query/get-addresses-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAddressCommand } from '../../application/address/commands/create-address/create-address.command';
import { UpdateAddressCommand } from '../../application/address/commands/update-address/update-address.command';
import { GetAddressesQuery } from '../../application/address/queries/get-addresses/get-addresses.query';
import { GetAddressByIdQuery } from '../../application/address/queries/get-address-by-id/get-address-by-id.query';
import { DeleteAddressCommand } from '../../application/address/commands/delete-address/delete-address.command';
import {
  OwnsResource,
  OwnsResourceGuard,
} from '@/shared/infrastructure/http/guards/owns-resource.guard';
import { Address } from '../../domain/entities/address';

// Bypass permission for the IDOR guard. Users that have this permission
// (typically ADMIN / SUPERVISOR) can act on any address, not just their own.
// Add it to ctl-permissions.seeder.ts + rol-permissions.seeder.ts to wire it
// to your admin roles.
const BYPASS_ADDRESS_OWNERSHIP = ['gestionar-cualquier-dirección'];

@Controller('addresses')
@ApiBearerAuth('JWT-auth')
export class AddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-dirección')
  @Post()
  @HttpCode(201)
  async create(
    @Body() addressCreateRequest: AddressDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateAddressCommand(addressCreateRequest);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'Address created successfully',
    );
  }
  @Permissions('editar-dirección')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Address>({
    paramKey: 'id',
    query: GetAddressByIdQuery,
    getOwnerId: (a) => a.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_ADDRESS_OWNERSHIP,
  })
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addressUpdateRequest: AddressDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdateAddressCommand({ ...addressUpdateRequest, id });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Address updated successfully',
    );
  }
  @Permissions('listar-direcciones')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetAddressesQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<AddressHttpDto>>> {
    const queryAddress = new GetAddressesQuery(query, query.filter);
    const result = await this.queryBus.execute<
      GetAddressesQuery,
      Pagination<Address>
    >(queryAddress);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((a) => AddressHttpDto.fromEntity(a));
    const response = new HttpPaginatedResponseDto<AddressHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<AddressHttpDto>>(
      response,
      HttpStatus.OK,
      'Addresses retrieved successfully',
    );
  }
  @Permissions('ver-dirección')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Address>({
    paramKey: 'id',
    query: GetAddressByIdQuery,
    getOwnerId: (a) => a.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_ADDRESS_OWNERSHIP,
  })
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<AddressHttpDto>> {
    const queryAddress = new GetAddressByIdQuery(id);
    const address = await this.queryBus.execute<
      GetAddressByIdQuery,
      Address | null
    >(queryAddress);
    if (!address) {
      throw new NotFoundException('Address', id.toString());
    }
    const addressDtoHttp = AddressHttpDto.fromEntity(address);
    return new SuccessResponseDto<AddressHttpDto>(
      addressDtoHttp,
      HttpStatus.OK,
      'Address retrieved successfully',
    );
  }
  @Permissions('eliminar-dirección')
  @UseGuards(OwnsResourceGuard)
  @OwnsResource<Address>({
    paramKey: 'id',
    query: GetAddressByIdQuery,
    getOwnerId: (a) => a.getIdPeople().value(),
    authField: 'id_people',
    bypassWithPermissions: BYPASS_ADDRESS_OWNERSHIP,
  })
  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<null>> {
    const command = new DeleteAddressCommand(id);
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'Address deleted successfully',
    );
  }
}
