import { RolDto } from '../../../dtos/rol.dto';

export class CreateRolCommand {
  constructor(public readonly rol_dto: RolDto) {}
}
