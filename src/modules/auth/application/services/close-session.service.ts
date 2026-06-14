import { AuthReadPort } from '../ports/auth-read.port';

export class CloseSessionService {
  constructor(private readonly closeSession: AuthReadPort) {}
  async run(token: {
    user_name: string;
    id: string;
    permissions: string[];
    refresh_token: string;
    id_session_refresh_token?: string;
  }): Promise<void> {
    await this.closeSession.closeSession(token);
  }
}
