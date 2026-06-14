import { UserId } from '../value-objects/user-value-object/user-id';
import { UserIdPeople } from '../value-objects/user-value-object/user-id-people';
import { UserIdStatus } from '../value-objects/user-value-object/user-id-status';
import { UserIsValidated } from '../value-objects/user-value-object/user-is-validated';
import { UserLastAccess } from '../value-objects/user-value-object/user-last-access';
import { UserName } from '../value-objects/user-value-object/user-name';

export class UserAuth {
  constructor(
    private readonly id_people: UserIdPeople,
    private readonly user_name: UserName,
    private readonly id_status: UserIdStatus,
    private readonly last_access: UserLastAccess,
    private readonly is_validated: UserIsValidated,
    private readonly permissions: string[],
    private readonly id?: UserId,
    private readonly id_session_refresh_token?: string,
  ) {}
  static create(data: {
    id_people: string;
    user_name: string;
    id_status: string;
    last_access: Date;
    is_validated: boolean;
    permissions: string[];
    id?: string;
    id_session_refresh_token?: string;
  }): UserAuth {
    return new UserAuth(
      new UserIdPeople(data.id_people),
      new UserName(data.user_name),
      new UserIdStatus(data.id_status),
      new UserLastAccess(data.last_access),
      new UserIsValidated(data.is_validated),
      data.permissions,
      data.id ? new UserId(data.id) : undefined,
      data.id_session_refresh_token ? data.id_session_refresh_token : undefined,
    );
  }
  public getId(): UserId | undefined {
    return this.id;
  }
  public getIdPeople(): UserIdPeople {
    return this.id_people;
  }
  public getUserName(): UserName {
    return this.user_name;
  }
  public getIdStatus(): UserIdStatus {
    return this.id_status;
  }
  public getLastAccess(): UserLastAccess {
    return this.last_access;
  }
  public getIsValidated(): UserIsValidated {
    return this.is_validated;
  }
  public getPermissions(): string[] {
    return this.permissions;
  }
  public getIdSessionRefreshToken(): string | undefined {
    return this.id_session_refresh_token;
  }
}
