import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';

import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserRoleByIdQuery } from '../../application/user-rol/queries/get-user-role-by-id/get-user-role-by-id.query';
import { UserRolExtendedDto } from '../../application/dtos/user-rol-extended.dto';
import { UserRolRequestDto } from '../dtos/validators/user-rol/user-rol.dto';
import { UpdateUserRoleByIdCommand } from '../../application/user-rol/commands/update-user-role-by-id/update-user-role-by-id.command';
import { UserRolDto } from '../../application/dtos/user-rol.dto';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('user-role')
@ApiBearerAuth('JWT-auth')
export class UserRolController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('ver-usuario-roles')
  @Get(':id')
  @HttpCode(200)
  async getUserRole(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseDto<UserRolExtendedDto>> {
    const query = new GetUserRoleByIdQuery(id);
    const userRole = await this.queryBus.execute<
      GetUserRoleByIdQuery,
      UserRolExtendedDto<unknown> | null
    >(query);
    if (!userRole) {
      throw new NotFoundException('User-Role', id.toString());
    }
    const userRoleDto = UserRolExtendedDto.fromDto(userRole);
    return new SuccessResponseDto<UserRolExtendedDto>(
      userRoleDto,
      HttpStatus.OK,
      'User role retrieved successfully',
    );
  }

  @Permissions('editar-usuario-rol')
  @Put(':id_user')
  @HttpCode(200)
  async updateUserRole(
    @Param('id_user', ParseUUIDPipe) id_user: string,
    @Body() updateUserRoleDto: UserRolRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    const userRole = new UserRolDto(id_user, updateUserRoleDto.id_role);
    const command = new UpdateUserRoleByIdCommand(userRole);

    await this.commandBus.execute(command);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.OK,
      'User role updated successfully',
    );
  }
}
