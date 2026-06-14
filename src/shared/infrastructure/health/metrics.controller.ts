import {
  Controller,
  Get,
  Res,
  SetMetadata,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { register } from 'prom-client';
import { Response } from 'express';

/**
 * Replaces the default controller shipped by @willsoto/nestjs-prometheus so
 * we can opt the route out of both the global URI versioning (it sits at
 * `/metrics`, not `/v1/metrics`) and the global JWT guard. Network isolation
 * is provided at the reverse-proxy / network-policy layer.
 */
@ApiExcludeController()
@Controller({ path: 'metrics', version: VERSION_NEUTRAL })
@SetMetadata('isPublic', true)
export class MetricsController {
  @Get()
  @SetMetadata('isPublic', true)
  async index(@Res({ passthrough: true }) res: Response): Promise<string> {
    res.header('Content-Type', register.contentType);
    return register.metrics();
  }
}
