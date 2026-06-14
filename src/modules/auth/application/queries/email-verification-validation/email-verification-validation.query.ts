import { UserDto } from '@/modules/identity-access-management/application/dtos/user.dto';

export class EmailVerificationValidationQuery {
  constructor(public readonly user_dto: UserDto) {}
}
