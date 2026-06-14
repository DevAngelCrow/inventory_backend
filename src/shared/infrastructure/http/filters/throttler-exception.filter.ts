import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

/**
 * Normalizes the non-standard `Retry-After-<name>` header that
 * @nestjs/throttler sets (e.g. `Retry-After-global`) to the RFC 7231
 * standard `Retry-After` header before responding with 429.
 */
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Move any Retry-After-<name> header to the standard Retry-After name.
    const headers = response.getHeaders();
    let retryAfterValue: string | undefined;
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase().startsWith('retry-after-')) {
        retryAfterValue = String(headers[key]);
        response.removeHeader(key);
      }
    }

    response.status(HttpStatus.TOO_MANY_REQUESTS);
    if (retryAfterValue !== undefined) {
      response.setHeader('Retry-After', retryAfterValue);
    }
    response.json({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: exception.message,
      error: 'Too Many Requests',
    });
  }
}
