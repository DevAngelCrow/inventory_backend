import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  showStackTrace: process.env.SHOW_STACK_TRACE === 'true',
  url: process.env.APP_URL ?? '',
  apiUrl: process.env.API_URL ?? '',
  clientUrl: process.env.CLIENT_URL ?? '',
  clientForgottenPassword: process.env.CLIENT_FORGOTTEN_PASSWORD,
  clientVerifyEmailRoute: process.env.CLIENT_VERIFY_EMAIL_ROUTE,
  enableApiDocs: process.env.ENABLE_API_DOCS === 'true',
  providerStorageCode: process.env.PROVIDER_STORAGE_CODE ?? '',
}));
