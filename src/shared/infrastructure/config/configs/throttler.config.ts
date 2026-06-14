import { registerAs } from '@nestjs/config';

export const throttlerConfig = registerAs('throttler', () => ({
  login: {
    ttl: parseInt(process.env.THROTTLE_LOGIN_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LOGIN_LIMIT ?? '5', 10),
  },
  global: {
    ttl: parseInt(process.env.THROTTLE_GLOBAL_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_GLOBAL_LIMIT ?? '100', 10),
  },
}));
