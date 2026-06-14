import { UserAuthDto } from '@/modules/identity-access-management/application/dtos/user-auth.dto';
import { AuthReadPort } from '../ports/auth-read.port';

export class TokenGeneratorService {
  constructor(private readonly authReadPort: AuthReadPort) {}
  async run(user: UserAuthDto): Promise<string> {
    return await this.authReadPort.generateToken(user);
  }
}
