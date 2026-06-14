import { Counter } from 'prom-client';

export const authLoginTotal = new Counter({
  name: 'auth_login_total',
  help: 'Total login attempts labeled by result (success|failure)',
  labelNames: ['result'] as const,
});

export const authRegisterTotal = new Counter({
  name: 'auth_register_total',
  help: 'Total completed user registrations',
});

export const authPasswordResetTotal = new Counter({
  name: 'auth_password_reset_total',
  help: 'Total password reset actions labeled by step (requested|completed)',
  labelNames: ['step'] as const,
});

export const storageFilesUploadedTotal = new Counter({
  name: 'storage_files_uploaded_total',
  help: 'Total files uploaded labeled by storage provider',
  labelNames: ['provider'] as const,
});

export const http4xxTotal = new Counter({
  name: 'http_4xx_errors_total',
  help: 'Total HTTP 4xx client errors labeled by status code',
  labelNames: ['status'] as const,
});

export const http5xxTotal = new Counter({
  name: 'http_5xx_errors_total',
  help: 'Total HTTP 5xx server errors labeled by status code',
  labelNames: ['status'] as const,
});
