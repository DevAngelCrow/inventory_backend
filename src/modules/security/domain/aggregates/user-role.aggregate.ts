import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { UserRoleId } from '../value-objects/user-role-value-object/user-role-id';
import { UserRoleIdUser } from '../value-objects/user-role-value-object/user-role-id-user';
import { UserRoleIdRol } from '../value-objects/user-role-value-object/user-role-id-rol';
import { UserRoleCreatedEvent } from '../events/user-role-created.event';

export class UserRoleAggregate extends AggregateRoot {
  constructor(
    private readonly id_user: UserRoleIdUser,
    private role: UserRoleIdRol[],
    private readonly id?: UserRoleId,
  ) {
    super();
  }
  getId(): UserRoleId | undefined {
    return this.id;
  }
  getIdUser(): UserRoleIdUser {
    return this.id_user;
  }
  getIdRole(): UserRoleIdRol[] {
    return this.role;
  }
  public static create(data: {
    id?: string;
    user_id: string;
    role_id: string[];
  }): UserRoleAggregate {
    const userRoleId = data.id ? new UserRoleId(data.id) : undefined;
    const userRoleIdUser = new UserRoleIdUser(data.user_id);
    const userRoleIdRol = data.role_id.map((rolId) => new UserRoleIdRol(rolId));
    return new UserRoleAggregate(userRoleIdUser, userRoleIdRol, userRoleId);
  }

  public created(): void {
    this.apply(
      new UserRoleCreatedEvent(
        this.id?.value(),
        this.id_user.value(),
        this.role.map((r) => r.value()),
      ),
    );
  }

  public updated(newRoles: UserRoleIdRol[]): void {
    this.role = newRoles;
    this.apply(
      new UserRoleCreatedEvent( // using created event for simplicity or we could make updated event
        this.id?.value(),
        this.id_user.value(),
        this.role.map((r) => r.value()),
      ),
    );
  }
}
