import { User } from '../entities/user';
import { UserId } from '../value-objects/user-value-object/user-id';
import { UserName } from '../value-objects/user-value-object/user-name';
import { UserPassword } from '../value-objects/user-value-object/user-password';

export abstract class UserRepository {
  public abstract create(user: User): Promise<User>;
  // public abstract update(user: User): Promise<void>;
  //public abstract getOneById(id: UserId): Promise<User | null>;
  public abstract markEmailAsVerified(user_id: UserId): Promise<void>;
  public abstract updateStatusUser(id: UserId): Promise<void>;
  public abstract updateNameUser(
    user_name: UserName,
    id: UserId,
  ): Promise<void>;
  public abstract resetPasswordUser(
    id: UserId,
    password: UserPassword,
    token: string,
  ): Promise<void>;
}
