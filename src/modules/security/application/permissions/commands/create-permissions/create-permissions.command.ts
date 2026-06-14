import { PermissionsDto } from '../../../dtos/permissions.dto';

export class CreatePermissionsCommand {
  constructor(public readonly permissions_dto: PermissionsDto) {}
}
