import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { WorkerModule } from './worker.module';

/**
 * Standalone entry point for BullMQ worker processes.
 *
 * Uses `createApplicationContext` (no HTTP server) so workers can be deployed
 * and scaled independently of the API. Run with:
 *   npm run start:worker:prod   # production
 *   npm run start:worker        # local
 *
 * Why a separate process: keeping workers in the API process means a job spike
 * starves request handlers, and a horizontally scaled API duplicates job
 * pickup. Running them on their own deployment fixes both.
 */
async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  const logger = app.get(Logger);
  logger.log('BullMQ worker process started');

  const shutdown = (signal: string) => {
    logger.log(`Received ${signal}, draining jobs before exit...`);
    void app
      .close()
      .catch((err) => {
        logger.error(
          { err: err instanceof Error ? err.message : String(err) },
          `Error during worker shutdown on ${signal}`,
        );
        process.exit(1);
      })
      .then(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrapWorker().catch((err) => {
  console.error('Worker bootstrap failed:', err);
  process.exit(1);
});
