import { GetRolesHandler } from '../../application/rol/queries/get-roles/get-roles.handler';
import { GetRolByIdHandler } from '../../application/rol/queries/get-rol-by-id/get-rol-by-id.handler';
import { GetRolByCodeHandler } from '../../application/rol/queries/get-rol-by-code/get-rol-by-code.handler';
import { GetPermissionsHandler } from '../../application/permissions/queries/get-permissions/get-permissions.handler';
import { GetPermissionsByIdHandler } from '../../application/permissions/queries/get-permissions-by-id/get-permissions-by-id.handler';
import { GetRoutesHandler } from '../../application/route/queries/get-routes/get-routes.handler';
import { GetRouteByIdHandler } from '../../application/route/queries/get-route-by-id/get-route-by-id.handler';
import { GetCategoryPermissionsHandler } from '../../application/category-permissions/queries/get-category-permissions/get-category-permissions.handler';
import { GetCategoryPermissionsByIdHandler } from '../../application/category-permissions/queries/get-category-permissions-by-id/get-category-permissions-by-id.handler';
import { GetUserRoleByIdHandler } from '../../application/user-rol/queries/get-user-role-by-id/get-user-role-by-id.handler';
import { GetUserIdsByRoleIdHandler } from '../../application/user-rol/queries/get-user-ids-by-role-id/get-user-ids-by-role-id.handler';
import { FilterRoutesUserHandler } from '../../application/security-authroization-port/filter-routes-user/queries/filter-routes-user.handler';
import { GetMenuUserHandler } from '../../application/menu/queries/get-menu-user/get-menu-user.handler';

export const queryHandlerProviders = [
  GetRolesHandler,
  GetRolByIdHandler,
  GetRolByCodeHandler,
  GetPermissionsHandler,
  GetPermissionsByIdHandler,
  GetRoutesHandler,
  GetRouteByIdHandler,
  GetCategoryPermissionsHandler,
  GetCategoryPermissionsByIdHandler,
  GetUserRoleByIdHandler,
  GetUserIdsByRoleIdHandler,
  FilterRoutesUserHandler,
  GetMenuUserHandler,
];
