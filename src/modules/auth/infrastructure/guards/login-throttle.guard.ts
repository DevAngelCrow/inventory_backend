import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const body = req['body'] as Record<string, string> | undefined;
    const userName = body?.user_name?.trim().toLowerCase();
    const headers = req['headers'] as
      | Record<string, string | string[] | undefined>
      | undefined;
    const forwardedFor = headers?.['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim();
    const ip = forwardedIp || (req.ip as string) || 'unknown-ip';

    if (!userName) return Promise.resolve(ip);

    return Promise.resolve(`${ip}:${userName}`);
  }
}
