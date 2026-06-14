import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';

const IDEMPOTENCY_TTL_MS = 86_400_000; // 24 hours
const KEY_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface CachedResponse {
  statusCode: number;
  body: unknown;
}

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idempotencyKey = req.headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || !KEY_REGEX.test(idempotencyKey)) {
      return next();
    }

    const cacheKey = `idempotency:${idempotencyKey}`;

    const cached = await this.cacheManager.get<CachedResponse>(cacheKey);
    if (cached) {
      res.setHeader('X-Idempotent-Replayed', 'true');
      res.status(cached.statusCode).json(cached.body);
      return;
    }

    // Capture the outgoing response so we can store it in Redis.
    const originalJson = res.json.bind(res) as (body?: unknown) => Response;
    res.json = (body?: unknown): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        this.cacheManager
          .set(
            cacheKey,
            { statusCode: res.statusCode, body },
            IDEMPOTENCY_TTL_MS,
          )
          .catch(() => {
            // Non-fatal — if Redis is down, idempotency degrades gracefully.
          });
      }
      return originalJson(body);
    };

    next();
  }
}
