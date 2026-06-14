import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { SetMetadata } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';

/** Bypasses the global JwtPassportAuthGuard — same key used by @SkipAuth() */
const SkipAuth = () => SetMetadata('isPublic', true);

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {}

  /** Full health check: verifies DB and Redis connectivity */
  @Get()
  @SkipAuth()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaIndicator.isHealthy('database'),
      () => this.redisIndicator.isHealthy('redis'),
    ]);
  }

  /** Liveness probe: confirms the process is alive (no I/O checks) */
  @Get('live')
  @SkipAuth()
  liveness(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /** Readiness probe: confirms the app can serve traffic (DB + Redis reachable) */
  @Get('ready')
  @SkipAuth()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaIndicator.isHealthy('database'),
      () => this.redisIndicator.isHealthy('redis'),
    ]);
  }
}
