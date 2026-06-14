import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT
    ? parseInt(process.env.EMAIL_PORT, 10)
    : undefined,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM,
  secret: process.env.EMAIL_SECRET,
  /** Whether email is fully configured and ready to send */
  enabled: !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_FROM
  ),
}));
