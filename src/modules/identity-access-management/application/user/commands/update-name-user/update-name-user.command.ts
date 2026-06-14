import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';
import { UserId } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-id';

export class UpdateNameUserCommand {
  constructor(
    public readonly user_name: UserName,
    public readonly id: UserId,
  ) {}
}
