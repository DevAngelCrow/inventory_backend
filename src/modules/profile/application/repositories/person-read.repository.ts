import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Person } from '../../domain/entities/person';
import { PersonEmail } from '../../domain/value-objects/person-value-object/person-email';
import { AuthenticateProfileDto } from '@/modules/auth/application/dtos/authenticate-profile.dto';

export abstract class PersonReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Person> | Person[]>;
  abstract getOneByIdProfile(
    id_user: string,
  ): Promise<AuthenticateProfileDto | null>;
  abstract getOneByEmail(email: PersonEmail): Promise<Person | null>;
}
