import { UserRepository } from '../../domain/repositories/user-repository';
import { ImplUserRepository } from '../implementation/impl-user.repository';
import { UserReadRepository } from '../../application/repositories/user-read.repository';

import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { ImplPasswordHasherPort } from '../implementation/impl-password-hasher.port';

export const respositories = [
  { provide: UserRepository, useClass: ImplUserRepository },
  {
    provide: UserReadRepository,
    useClass: ImplUserRepository,
  },
  {
    provide: PasswordHasherPort,
    useClass: ImplPasswordHasherPort,
  },
];
