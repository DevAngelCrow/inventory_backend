import * as bcrypt from 'bcrypt';
export class PasswordHasher {
  constructor(private readonly saltRounds: number = 10) {}
  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }
  async compare(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
