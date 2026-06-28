import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { UserId } from '../value-objects/user-value-object/user-id';
import { UserIdPeople } from '../value-objects/user-value-object/user-id-people';
import { UserIdStatus } from '../value-objects/user-value-object/user-id-status';
import { UserIsValidated } from '../value-objects/user-value-object/user-is-validated';
import { UserLastAccess } from '../value-objects/user-value-object/user-last-access';
import { UserName } from '../value-objects/user-value-object/user-name';
import { UserPassword } from '../value-objects/user-value-object/user-password';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserNameUpdatedEvent } from '../events/user-name-updated.event';
import { UserPasswordResetEvent } from '../events/user-password-reset.event';
import { UserEmailVerifiedEvent } from '../events/user-email-verified.event';

export class User extends AggregateRoot {
  constructor(
    private readonly id_people: UserIdPeople,
    private user_name: UserName,
    private password: UserPassword,
    private id_status: UserIdStatus,
    private last_access: UserLastAccess,
    private is_validated: UserIsValidated,
    private readonly id?: UserId,
  ) {
    super();
  }

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

  public created(): void {
    if (this.id) {
      this.apply(
        new UserCreatedEvent(
          this.id.value(),
          this.user_name.value(),
          this.id_people.value(),
          this.id_status.value(),
          this.is_validated.value(),
        ),
      );
    }
  }

  public updateName(newName: UserName): void {
    this.user_name = newName;
    if (this.id) {
      this.apply(new UserNameUpdatedEvent(this.id.value(), newName.value()));
    }
  }

  public resetPassword(newPassword: UserPassword): void {
    this.password = newPassword;
    if (this.id) {
      this.apply(new UserPasswordResetEvent(this.id.value()));
    }
  }

  public verifyEmail(activeStatusId: UserIdStatus): void {
    this.is_validated = new UserIsValidated(true);
    this.id_status = activeStatusId;
    if (this.id) {
      this.apply(new UserEmailVerifiedEvent(this.id.value(), activeStatusId.value()));
    }
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
