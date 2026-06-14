import { AuthReadPort } from '../ports/auth-read.port';

export class CredentialsValidationService {
  constructor(private readonly authReadPort: AuthReadPort) {}
  async run(
    user_name: string,
    password: string,
    db_password: string,
  ): Promise<boolean> {
    const isValid = await this.authReadPort.validateCredentials(
      user_name,
      password,
      db_password,
    );
    return isValid;
  }
}
