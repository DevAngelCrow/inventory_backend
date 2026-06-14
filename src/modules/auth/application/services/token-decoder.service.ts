import { AuthReadPort } from '../ports/auth-read.port';

export class TokenDedecoderService<T> {
  constructor(private readonly authReadPort: AuthReadPort) {}
  async run(token: string, isRefreshToken: boolean = false): Promise<T> {
    return await this.authReadPort.decodeToken(token, isRefreshToken);
  }
}
