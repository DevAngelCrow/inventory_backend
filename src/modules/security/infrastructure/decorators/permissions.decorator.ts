import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const PERMISSIONS_ALL_KEY = 'permissions_all';

/** Grants access if the user has ANY of the listed permissions. */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/** Grants access only if the user has ALL of the listed permissions. */
export const RequireAllPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_ALL_KEY, permissions);
