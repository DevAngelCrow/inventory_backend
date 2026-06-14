import { UserId } from '../value-objects/user-value-object/user-id';
import { UserIdPeople } from '../value-objects/user-value-object/user-id-people';
import { UserIdStatus } from '../value-objects/user-value-object/user-id-status';
import { UserIsValidated } from '../value-objects/user-value-object/user-is-validated';
import { UserLastAccess } from '../value-objects/user-value-object/user-last-access';
import { UserName } from '../value-objects/user-value-object/user-name';
import { UserPassword } from '../value-objects/user-value-object/user-password';

export class User {
  constructor(
    private readonly id_people: UserIdPeople,
    private readonly user_name: UserName,
    private readonly password: UserPassword,
    private readonly id_status: UserIdStatus,
    private readonly last_access: UserLastAccess,
    private readonly is_validated: UserIsValidated,
    private readonly id?: UserId,
  ) {}
  static create(data: {
    id_people: string;
    user_name: string;
    password: string;
    id_status: string;
    last_access: Date;
    is_validated: boolean;
    id?: string;
  }): User {
    return new User(
      new UserIdPeople(data.id_people),
      new UserName(data.user_name),
      new UserPassword(data.password),
      new UserIdStatus(data.id_status),
      new UserLastAccess(data.last_access),
      new UserIsValidated(data.is_validated),
      data.id ? new UserId(data.id) : undefined,
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
  public getPassword(): UserPassword {
    return this.password;
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
}
