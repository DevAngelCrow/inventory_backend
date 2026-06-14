import { createHash, timingSafeEqual } from 'crypto';

export class JwtTokenHasher {
  /**
   * Hashes a JWT refresh token using SHA-256.
   * bcrypt is not used here because it silently truncates input at 72 bytes —
   * tokens for the same user share identical first 72 bytes, making bcrypt
   * unable to distinguish them. SHA-256 operates on the full token without any
   * length limit. Refresh tokens are already high-entropy (HMAC-SHA256 output),
   * so a fast digest is sufficient; no password-KDF slow hashing is needed.
   */
  hash(token: string): Promise<string> {
    return Promise.resolve(createHash('sha256').update(token).digest('hex'));
  }

  compare(token: string, storedHash: string): Promise<boolean> {
    const incoming = Buffer.from(
      createHash('sha256').update(token).digest('hex'),
    );
    const stored = Buffer.from(storedHash);
    if (incoming.length !== stored.length) {
      return Promise.resolve(false);
    }
    return Promise.resolve(timingSafeEqual(incoming, stored));
  }
}
