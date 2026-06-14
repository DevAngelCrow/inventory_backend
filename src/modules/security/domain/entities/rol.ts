import { RolCode } from '../value-objects/rol-value-object/rol-code';
import { RolDescription } from '../value-objects/rol-value-object/rol-description';
import { RolId } from '../value-objects/rol-value-object/rol-id';
import { RolIdStatus } from '../value-objects/rol-value-object/rol-id-status';
import { RolName } from '../value-objects/rol-value-object/rol-name';

export class Rol {
  constructor(
    private readonly name: RolName,
    private readonly description: RolDescription,
    private readonly id_status: RolIdStatus,
    private readonly code: RolCode,
    private readonly id?: RolId,
    private readonly id_permissions?: string[],
  ) {}
  public static create(data: {
    id?: string;
    name: string;
    description: string;
    id_status: string;
    code: string;
    id_permissions?: string[];
  }): Rol {
    return new Rol(
      new RolName(data.name),
      new RolDescription(data.description),
      new RolIdStatus(data.id_status),
      new RolCode(data.code),
      data.id ? new RolId(data.id) : undefined,
      data.id_permissions,
    );
  }
  getName(): RolName {
    return this.name;
  }
  getDescription(): RolDescription {
    return this.description;
  }
  getIdStatus(): RolIdStatus {
    return this.id_status;
  }
  getCode(): RolCode {
    return this.code;
  }
  getId(): RolId | undefined {
    return this.id;
  }
  getIdPermissions(): string[] | undefined {
    return this.id_permissions;
  }
}
