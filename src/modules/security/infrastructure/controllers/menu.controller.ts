import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Menu } from '../interfaces/menu.interface';
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';
import { MenuHttpDto } from '../dtos/http/menu-http-dto/menu-http.dto';
import { MenuUserResponseDto } from '../dtos/http/menu-http-dto/menu-user-response.dto';
import { Permissions } from '../decorators/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { GetMenuUserQuery } from '../../application/menu/queries/get-menu-user/get-menu-user.query';
import { MenuUserResult } from '../../application/menu/queries/get-menu-user/get-menu-user.handler';

@Controller('menus')
@ApiBearerAuth('JWT-auth')
export class MenuController {
  constructor(private readonly queryBus: QueryBus) {}
  @Permissions('ver-menu-usuario')
  @Get()
  @HttpCode(200)
  async menu(
    @Req() request: Request<{ headers: { authorization: string } }>,
  ): Promise<SuccessResponseDto<MenuUserResponseDto<Menu>>> {
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const query = new GetMenuUserQuery(token);
    const result: MenuUserResult<Menu> = await this.queryBus.execute(query);
    const menuDto = result.menus.map((menu) =>
      MenuHttpDto.fromEntity<Menu>(menu),
    );
    return new SuccessResponseDto<MenuUserResponseDto<Menu>>(
      new MenuUserResponseDto(menuDto, result.profile_img),
      HttpStatus.OK,
      'Menu retrieved successfully',
    );
  }
}
