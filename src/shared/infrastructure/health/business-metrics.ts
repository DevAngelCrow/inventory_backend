import { Counter } from 'prom-client';

export const authLoginTotal = new Counter<'result'>({
  name: 'auth_login_total',
  help: 'Total login attempts labeled by result (success|failure)',
  labelNames: ['result'],
});

export const authRegisterTotal = new Counter({
  name: 'auth_register_total',
  help: 'Total completed user registrations',
});

export const authPasswordResetTotal = new Counter<'step'>({
  name: 'auth_password_reset_total',
  help: 'Total password reset actions labeled by step (requested|completed)',
  labelNames: ['step'],
});

export const storageFilesUploadedTotal = new Counter<'provider'>({
  name: 'storage_files_uploaded_total',
  help: 'Total files uploaded labeled by storage provider',
  labelNames: ['provider'],
});

export const http4xxTotal = new Counter<'status'>({
  name: 'http_4xx_errors_total',
  help: 'Total HTTP 4xx client errors labeled by status code',
  labelNames: ['status'],
});

export const http5xxTotal = new Counter<'status'>({
  name: 'http_5xx_errors_total',
  help: 'Total HTTP 5xx server errors labeled by status code',
  labelNames: ['status'],
});
