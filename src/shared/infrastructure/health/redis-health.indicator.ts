import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private static readonly PROBE_KEY = '__health_probe__';
  private static readonly PROBE_VALUE = '1';
  private static readonly PROBE_TTL_MS = 1000;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.cache.set(
        RedisHealthIndicator.PROBE_KEY,
        RedisHealthIndicator.PROBE_VALUE,
        RedisHealthIndicator.PROBE_TTL_MS,
      );
      const value = await this.cache.get<string>(
        RedisHealthIndicator.PROBE_KEY,
      );
      if (value !== RedisHealthIndicator.PROBE_VALUE) {
        throw new Error('Redis probe value mismatch');
      }
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, {
          message: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }
}
