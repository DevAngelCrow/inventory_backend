import { PermissionsDto } from '../../../dtos/permissions.dto';

export class UpdatePermissionsCommand {
  constructor(public readonly permissions_dto: PermissionsDto) {}
}
