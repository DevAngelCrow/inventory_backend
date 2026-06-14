import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TokenDedecoderService } from '@/modules/auth/application/services/token-decoder.service';
import { FilterRoutesUserHandler } from '../../../security-authroization-port/filter-routes-user/queries/filter-routes-user.handler';
import { GetMenuUserQuery } from './get-menu-user.query';
import { Menu } from '@/modules/security/domain/entities/menu';
import { SecurityAuthorizationPort } from '@/modules/security/domain/ports/security-authorization.port';

export interface MenuUserResult<T> {
  menus: Menu<T>[];
  profile_img: string | null;
}

@QueryHandler(GetMenuUserQuery)
export class GetMenuUserHandler<T> implements IQueryHandler<GetMenuUserQuery> {
  constructor(
    private readonly filterUserMenu: FilterRoutesUserHandler<T>,
    private readonly decoderTokenService: TokenDedecoderService<{ id: string }>,
    private readonly securityAuthorizationPort: SecurityAuthorizationPort,
  ) {}
  async execute(query: GetMenuUserQuery): Promise<MenuUserResult<T>> {
    const decodedToken = await this.decoderTokenService.run(query.token);
    const id_user = decodedToken.id;
    const [menus, profile_img] = await Promise.all([
      this.filterUserMenu.execute({ id_user }),
      this.securityAuthorizationPort.getUserProfileImg(id_user),
    ]);
    return { menus, profile_img };
  }
}
