import { SetMetadata } from '@nestjs/common';

export const CHECK_AUTHENTICATED_USER = 'check_authenticated_user';
export const CheckAuthenticatedUser = (paramName: string) =>
  SetMetadata(CHECK_AUTHENTICATED_USER, paramName);
