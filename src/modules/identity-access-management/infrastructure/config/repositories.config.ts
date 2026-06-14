import { UserRepository } from '../../domain/repositories/user-repository';
import { ImplUserRepository } from '../implementation/impl-user.repository';
import { UserReadRepository } from '../../application/repositories/user-read.repository';

export const respositories = [
  { provide: UserRepository, useClass: ImplUserRepository },
  {
    provide: UserReadRepository,
    useClass: ImplUserRepository,
  },
];
