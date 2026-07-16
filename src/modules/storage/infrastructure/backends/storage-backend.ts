import { Express } from 'express';

/**
 * Pluggable storage backend. Each implementation is responsible for taking
 * the raw uploaded buffer and persisting it somewhere durable (local disk,
 * S3, GCS, R2, etc.), then returning the canonical path that downstream
 * consumers will use to retrieve the file.
 *
 * `path` semantics depend on the backend:
 *   - LOCAL → absolute filesystem path
 *   - S3    → `s3://<bucket>/<key>` (or the configured public URL when one
 *             is provided)
 */
export abstract class StorageBackend {
  /** Provider code from ctl_provider_storage this backend serves (LOCAL/S3/…). */
  abstract readonly code: string;

  abstract upload(file: Express.Multer.File, folder?: string): Promise<{ path: string }>;
}
