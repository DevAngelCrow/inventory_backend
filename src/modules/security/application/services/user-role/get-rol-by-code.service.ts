import { RolDto } from '../../dtos/rol.dto';
import { GetRolByCodeHandler } from '../../rol/queries/get-rol-by-code/get-rol-by-code.handler';

export class GetRoleByCodeService {
  constructor(private readonly getRoleByCodeHandler: GetRolByCodeHandler) {}
  async run(code: string): Promise<RolDto | null> {
    const data = {
      code: code,
    };
    return await this.getRoleByCodeHandler.execute(data);
  }
}
