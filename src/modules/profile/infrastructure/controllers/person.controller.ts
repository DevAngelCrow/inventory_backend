import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { PersonHttpDto } from '../dtos/http/person-http-dto/person-http.dto';
import { PersonDto } from '../dtos/validators/person/person.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { GetPeopleQueryDto } from '../dtos/query/get-people-query.dto';
import { Person } from '../../domain/entities/person';

import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileByIdPersonQuery } from '../../application/person/queries/get-profile-by-id-person/get-profile-by-id-person.query';
import { AuthenticateProfileDto } from '@/modules/auth/application/dtos/authenticate-profile.dto';
import { CreatePersonCommand } from '../../application/person/commands/create-person/create-person.command';
import { UpdatePersonCommand } from '../../application/person/commands/update-person/update-person.command';
import { GetPersonByIdQuery } from '../../application/person/queries/get-person-by-id/get-person-by-id.query';
import { GetPeopleQuery } from '../../application/person/queries/get-people/get-people.query';
import { CheckAuthenticatedUserGuard } from '@/modules/auth/infrastructure/guards/check-authenticated-user.guard';
import { CheckAuthenticatedUser } from '@/modules/auth/infrastructure/decorators/check-authenticated-user.decorator';
@Controller('people')
@ApiBearerAuth('JWT-auth')
export class PersonController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-persona')
  @Post()
  @HttpCode(201)
  async create(
    @Body() personCreateRequest: PersonDto,
  ): Promise<SuccessResponseDto<PersonHttpDto | null>> {
    const command = new CreatePersonCommand(personCreateRequest);
    const person = await this.commandBus.execute<
      CreatePersonCommand,
      Person | null
    >(command);
    let personHttpDto: PersonHttpDto | null;
    if (person) {
      personHttpDto = PersonHttpDto.fromEntity(person);
      return new SuccessResponseDto<PersonHttpDto>(
        personHttpDto,
        201,
        'Person created successfully',
      );
    }
    return new SuccessResponseDto<null>(
      null,
      201,
      'Person creation successfully',
    );
  }
  @Permissions('editar-persona')
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonRequest: PersonDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new UpdatePersonCommand({ id, ...updatePersonRequest });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      200,
      'Person updated successfully',
    );
  }
  @Permissions('ver-persona')
  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<PersonHttpDto>> {
    const query = new GetPersonByIdQuery(id);
    const person = await this.queryBus.execute<
      GetPersonByIdQuery,
      Person | null
    >(query);
    if (!person) {
      throw new NotFoundException('Person', id.toString());
    }
    const personHttpDto = PersonHttpDto.fromEntity(person);
    return new SuccessResponseDto<PersonHttpDto>(
      personHttpDto,
      200,
      'Person retrieved successfully',
    );
  }
  @Permissions('listar-personas')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetPeopleQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<PersonHttpDto>>> {
    const appQuery = new GetPeopleQuery(query, query.filter);
    const result = await this.queryBus.execute<
      GetPeopleQuery,
      Pagination<Person>
    >(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((person) => PersonHttpDto.fromEntity(person));
    const response = new HttpPaginatedResponseDto<PersonHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<PersonHttpDto>>(
      response,
    );
  }
  @Permissions('ver-mi-perfil')
  @UseGuards(CheckAuthenticatedUserGuard)
  @CheckAuthenticatedUser('id_user')
  @Get('detail/:id_user')
  @HttpCode(200)
  async getOneByIdProfile(
    @Param('id_user', ParseUUIDPipe) id_user: string,
  ): Promise<SuccessResponseDto<AuthenticateProfileDto>> {
    const query = new GetProfileByIdPersonQuery(id_user);
    const person = await this.queryBus.execute<
      GetProfileByIdPersonQuery,
      AuthenticateProfileDto | null
    >(query);
    if (!person) {
      throw new NotFoundException('Person', id_user.toString());
    }
    const authenticateProfileDto = AuthenticateProfileDto.fromDto(person);
    return new SuccessResponseDto<AuthenticateProfileDto>(
      authenticateProfileDto,
      200,
      'Person retrieved successfully',
    );
  }
}
