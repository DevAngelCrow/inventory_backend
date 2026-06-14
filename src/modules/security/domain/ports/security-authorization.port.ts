import { Menu } from '../entities/menu';

export abstract class SecurityAuthorizationPort {
  abstract hasRole(role: string[], id_user: string): Promise<boolean>;
  abstract checkPermission(
    permission: string,
    id_user: string,
  ): Promise<boolean>;
  abstract filterRoutesForUser<T>(id_user: string): Promise<Menu<T>[]>;
  abstract getUserProfileImg(id_user: string): Promise<string | null>;
}
