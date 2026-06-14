import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { ApplicationException } from 'src/shared/application/exceptions/application.exception';
import { InfrastructureException } from '../../exceptions/infrastructure.exception';
import { NotFoundException } from 'src/shared/domain/exceptions/not-found.exception';
import { ConflictException } from '@/shared/domain/exceptions/conflict-exception';
import { ValidationException } from 'src/shared/domain/exceptions/validation.exception';
import { BadRequestException } from 'src/shared/domain/exceptions/bad-request.exception';
import { AccountLockedException } from '@/shared/domain/exceptions/account-locked.exception';
import { UnauthorizedException } from 'src/shared/application/exceptions/unauthorized.exception';
import { ForbiddenException } from 'src/shared/application/exceptions/forbidden.exception';
import { DatabaseException } from '../../exceptions/database.exception';
import { ExternalServiceException } from '../../exceptions/external-service.exception';
import { PayloadTooLargeException } from '../../exceptions/payload-too-large.exception';
import { ErrorResponseDto } from '../dtos/http-error-response.dto';

export class ExceptionMapper {
  private static readonly DOMAIN_STATUS_MAP = new Map<string, HttpStatus>([
    [NotFoundException.name, HttpStatus.NOT_FOUND],
    [ConflictException.name, HttpStatus.CONFLICT],
    [ValidationException.name, HttpStatus.BAD_REQUEST],
    [BadRequestException.name, HttpStatus.BAD_REQUEST],
    [AccountLockedException.name, 423],
  ]);

  private static readonly APPLICATION_STATUS_MAP = new Map<string, HttpStatus>([
    [UnauthorizedException.name, HttpStatus.UNAUTHORIZED],
    [ForbiddenException.name, HttpStatus.FORBIDDEN],
  ]);

  private static readonly INFRASTRUCTURE_STATUS_MAP = new Map<
    string,
    HttpStatus
  >([
    [DatabaseException.name, HttpStatus.SERVICE_UNAVAILABLE],
    [ExternalServiceException.name, HttpStatus.BAD_GATEWAY],
    [PayloadTooLargeException.name, HttpStatus.PAYLOAD_TOO_LARGE],
  ]);

  static toHttpException(error: Error, path?: string): HttpException {
    if ((error as { type?: string }).type === 'entity.too.large') {
      return this.mapInfrastructureException(
        new PayloadTooLargeException(),
        path,
      );
    }

    // Map Prisma's known error codes to domain exceptions so individual repos
    // don't need to keep replicating the try/catch + code-switch pattern. New
    // repos can let the error bubble — this filter will translate it.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const translated = this.translatePrismaError(error);
      if (translated) {
        return this.toHttpException(translated, path);
      }
    }

    if (error instanceof DomainException) {
      return this.mapDomainException(error, path);
    }

    if (error instanceof ApplicationException) {
      return this.mapApplicationException(error, path);
    }

    if (error instanceof InfrastructureException) {
      return this.mapInfrastructureException(error, path);
    }

    return this.mapUnknownException(error, path);
  }

  /**
   * Maps the most common Prisma error codes (https://www.prisma.io/docs/orm/reference/error-reference)
   * to the project's domain exceptions. Returns null for codes we don't have
   * a specific translation for — the caller falls through to the unknown-error
   * handler (500).
   */
  private static translatePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ): Error | null {
    const target = this.formatPrismaTarget(error.meta?.target);
    switch (error.code) {
      case 'P2002':
        return new ConflictException(
          target
            ? `A record with the same ${target} already exists`
            : 'A record with these values already exists',
        );
      case 'P2025':
        return new NotFoundException(
          'Record',
          typeof error.meta?.cause === 'string'
            ? error.meta.cause
            : 'requested',
        );
      case 'P2003':
        return new BadRequestException(
          target
            ? `Referenced record does not exist for ${target}`
            : 'Referenced record does not exist',
        );
      case 'P2014':
        return new BadRequestException(
          'The change would violate a required relation',
        );
      default:
        return null;
    }
  }

  private static formatPrismaTarget(target: unknown): string | null {
    if (!target) return null;
    if (Array.isArray(target)) return target.join(', ');
    if (typeof target === 'string') return target;
    return null;
  }

  private static mapDomainException(
    error: DomainException,
    path?: string,
  ): HttpException {
    const status =
      this.DOMAIN_STATUS_MAP.get(error.constructor.name) ??
      HttpStatus.BAD_REQUEST;

    const response = new ErrorResponseDto(
      status,
      error.message,
      'DOMAIN_ERROR',
      error.constructor.name.replace('Exception', '').toUpperCase(),
      path,
      error.errorCode,
    );

    if (error instanceof AccountLockedException) {
      (response as ErrorResponseDto & { retry_after: string }).retry_after =
        error.retryAfter.toISOString();
    }

    return new HttpException(response, status);
  }

  private static mapApplicationException(
    error: ApplicationException,
    path?: string,
  ): HttpException {
    const status =
      this.APPLICATION_STATUS_MAP.get(error.constructor.name) ??
      HttpStatus.BAD_REQUEST;

    const response = new ErrorResponseDto(
      status,
      error.message,
      'APPLICATION_ERROR',
      error.code,
      path,
      error.errorCode,
    );

    return new HttpException(response, status);
  }

  private static mapInfrastructureException(
    error: InfrastructureException,
    path?: string,
  ): HttpException {
    const status =
      this.INFRASTRUCTURE_STATUS_MAP.get(error.constructor.name) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const response = new ErrorResponseDto(
      status,
      error.message,
      'INFRASTRUCTURE_ERROR',
      error.code,
      path,
    );

    return new HttpException(response, status);
  }

  private static mapUnknownException(
    error: Error,
    path?: string,
  ): HttpException {
    const response = new ErrorResponseDto(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'INTERNAL_ERROR',
      'INTERNAL_SERVER_ERROR',
      path,
    );

    return new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
