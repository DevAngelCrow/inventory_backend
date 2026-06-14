import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/validators/user/create-user.dto';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { UserHttpDto } from '../dtos/http/user-http.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/user/commands/create-user/create-user.command';
import { GetUserByUserNameQuery } from '../../application/user/queries/get-user-by-user-name/get-user-by-user-name.query';
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';
import { GetUsersQueryDto } from '../dtos/query/get-users-query.dto';
import { GetUsersQuery } from '../../application/user/queries/get-users/get-users.query';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { UserDto } from '../../application/dtos/user.dto';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { CheckAuthenticatedUserGuard } from '@/modules/auth/infrastructure/guards/check-authenticated-user.guard';
import { CheckAuthenticatedUser } from '@/modules/auth/infrastructure/decorators/check-authenticated-user.decorator';
import { Auditable } from '@/modules/audit/infrastructure/decorators/auditable.decorator';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Permissions('crear-usuario')
  @Auditable({
    action: AuditAction.USER_CREATED_BY_ADMIN,
    entityType: 'User',
    entityIdFrom: 'body.email',
  })
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a user (admin)' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() userCreateRequest: CreateUserDto,
  ): Promise<SuccessResponseDto<null>> {
    const command = new CreateUserCommand({
      ...userCreateRequest,
      last_access: new Date(),
      is_validated: false,
      permissions: [],
    });
    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'User created successfully',
    );
  }
  @Permissions('ver-usuario-nombre')
  @UseGuards(CheckAuthenticatedUserGuard)
  @CheckAuthenticatedUser('user_name')
  @Get('user-name/:user_name')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, description: 'User found', type: UserHttpDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getByUserName(
    @Param('user_name') user_name: string,
  ): Promise<SuccessResponseDto<UserHttpDto>> {
    const query = new GetUserByUserNameQuery(user_name);
    const user = await this.queryBus.execute<
      GetUserByUserNameQuery,
      { user: UserDto<unknown> } | null
    >(query);
    if (!user) {
      throw new NotFoundException('User', user_name.toString());
    }
    const userHttpDto = UserHttpDto.fromDto(user.user);
    return new SuccessResponseDto<UserHttpDto>(
      userHttpDto,
      HttpStatus.OK,
      `User with user_name ${user_name} retrieved successfully`,
    );
  }
  @Permissions('listar-usuarios')
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List users with pagination and optional filters' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAll(
    @Query() query: GetUsersQueryDto,
  ): Promise<SuccessResponseDto<HttpPaginatedResponseDto<UserHttpDto>>> {
    const appQuery = new GetUsersQuery(query, {
      name: query.name,
      email: query.email,
      status: query.id_status,
    });
    const result = await this.queryBus.execute(appQuery);

    const items = result instanceof Pagination ? result.getEntityList() : [];
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((u: UserDto) => UserHttpDto.fromDto(u));
    const response = new HttpPaginatedResponseDto<UserHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<HttpPaginatedResponseDto<UserHttpDto>>(
      response,
      HttpStatus.OK,
      'Users retrieved successfully',
    );
  }
}
