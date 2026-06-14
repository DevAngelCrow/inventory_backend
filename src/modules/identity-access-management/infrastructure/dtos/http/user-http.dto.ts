import { User } from '@/modules/identity-access-management/domain/entities/user';
import { UserDto } from '../../../application/dtos/user.dto';

export class UserHttpDto<S = unknown> {
  constructor(
    public readonly user_name: string,
    public readonly id_status: string,
    public readonly is_validated: boolean,
    public readonly id?: string,
    public readonly status?: S,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly id_people?: string,
  ) {}
  public static fromEntity(user: User): UserHttpDto {
    return new UserHttpDto(
      user.getUserName().value(),
      user.getIdStatus().value(),
      user.getIsValidated().value(),
      user.getId() ? user.getId()?.value() : undefined,
      undefined,
      undefined,
      undefined,
      user.getIdPeople().value(),
    );
  }
  public static fromDto(userDto: UserDto): UserHttpDto {
    return new UserHttpDto(
      userDto.user_name,
      userDto.id_status,
      userDto.is_validated,
      userDto.id,
      userDto.status,
      userDto.email,
      userDto.phone,
      userDto.id_people,
    );
  }
}
