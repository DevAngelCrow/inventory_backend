import { CreateRolHandler } from '../../application/rol/commands/create-rol/create-rol.handler';
import { UpdateRolHandler } from '../../application/rol/commands/update-rol/update-rol.handler';
import { DeleteRolHandler } from '../../application/rol/commands/delete-rol/delete-rol.handler';
import { CreatePermissionsHandler } from '../../application/permissions/commands/create-permissions/create-permissions.handler';
import { UpdatePermissionsHandler } from '../../application/permissions/commands/update-permissions/update-permissions.handler';
import { DeletePermissionsHandler } from '../../application/permissions/commands/delete-permissions/delete-permissions.handler';
import { CreateRouteHandler } from '../../application/route/commands/create-route/create-route.handler';
import { UpdateRouteHandler } from '../../application/route/commands/update-route/update-route.handler';
import { DeleteRouteHandler } from '../../application/route/commands/delete-route/delete-route.handler';
import { CreateCategoryPermissionsHandler } from '../../application/category-permissions/commands/create-category-permissions/create-category-permissions.handler';
import { UpdateCategoryPermissionsHandler } from '../../application/category-permissions/commands/update-category-permissions/update-category-permissions.handler';
import { DeleteCategoryPermissionsHandler } from '../../application/category-permissions/commands/delete-category-permissions/delete-category-permissions.handler';
import { UpdateUserRoleByIdHandler } from '../../application/user-rol/commands/update-user-role-by-id/update-user-role-by-id.handler';
import { CreateUserRoleHandler } from '../../application/user-rol/commands/create-user-role/create-user-role.handler';

export const commandHandlerProviders = [
  CreateRolHandler,
  UpdateRolHandler,
  DeleteRolHandler,
  CreatePermissionsHandler,
  UpdatePermissionsHandler,
  DeletePermissionsHandler,
  CreateRouteHandler,
  UpdateRouteHandler,
  DeleteRouteHandler,
  CreateCategoryPermissionsHandler,
  UpdateCategoryPermissionsHandler,
  DeleteCategoryPermissionsHandler,
  UpdateUserRoleByIdHandler,
  CreateUserRoleHandler,
];
