import { RolDto } from '../../../dtos/rol.dto';

export class UpdateRolCommand {
  constructor(public readonly rol_dto: RolDto) {}
}
