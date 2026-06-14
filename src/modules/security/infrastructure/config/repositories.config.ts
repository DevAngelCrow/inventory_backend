import { SecurityAuthorizationPort } from '../../domain/ports/security-authorization.port';
import { CategoryPermissionsRepository } from '../../domain/repositories/category-permissions-repository';
import { PermissionsRepository } from '../../domain/repositories/permissions-repository';
import { RolRepository } from '../../domain/repositories/rol-repository';
import { RouteRepository } from '../../domain/repositories/route-repository';
import { UserRoleRepository } from '../../domain/repositories/user-rol-repository';
import { ImplSecurityAuthorizationPort } from '../implementation/impl-authorization.port';
import { ImplCategoryPermissionsRepository } from '../implementation/impl-category-permissions.repository';
import { ImplPermissionsRepository } from '../implementation/impl-permissions.repository';
import { ImplRolRepository } from '../implementation/impl-rol.repository';
import { ImplRouteRepository } from '../implementation/impl-route.repository';
import { ImplUserRoleRepository } from '../implementation/impl-user-role.repository';
import { RouteReadRepository } from '../../application/repositories/route-read.repository';
import { CategoryPermissionsReadRepository } from '../../application/repositories/category-permissions-read.repository';
import { PermissionsReadRepository } from '../../application/repositories/permissions-read.repository';
import { RolReadRepository } from '../../application/repositories/rol-read.repository';
import { UsersRoleReadRepository } from '../../application/repositories/user-rol-read.repository';
import { AuthReadPort } from '@/modules/auth/application/ports/auth-read.port';
import { ImplAuthPort } from '@/modules/auth/infrastructure/implementation/auth-port-implementation/impl-auth.port';
import { CachePort } from '../../domain/ports/cache.port';
import { ImplCachePort } from '../implementation/impl-cache.port';

export const repositories = [
  { provide: RouteRepository, useClass: ImplRouteRepository },
  {
    provide: CategoryPermissionsRepository,
    useClass: ImplCategoryPermissionsRepository,
  },
  { provide: PermissionsRepository, useClass: ImplPermissionsRepository },
  { provide: RolRepository, useClass: ImplRolRepository },
  { provide: UserRoleRepository, useClass: ImplUserRoleRepository },
  {
    provide: SecurityAuthorizationPort,
    useClass: ImplSecurityAuthorizationPort,
  },
  {
    provide: AuthReadPort,
    useClass: ImplAuthPort,
  },
  { provide: RouteReadRepository, useClass: ImplRouteRepository },
  {
    provide: CategoryPermissionsReadRepository,
    useClass: ImplCategoryPermissionsRepository,
  },
  { provide: PermissionsReadRepository, useClass: ImplPermissionsRepository },
  { provide: RolReadRepository, useClass: ImplRolRepository },
  { provide: UsersRoleReadRepository, useClass: ImplUserRoleRepository },
  { provide: CachePort, useClass: ImplCachePort },
];
