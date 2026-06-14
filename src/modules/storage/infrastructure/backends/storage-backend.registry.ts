import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageBackend } from './storage-backend';
import { LocalStorageBackend } from './local-storage.backend';
import { S3StorageBackend } from './s3-storage.backend';

/**
 * Resolves which `StorageBackend` to use at upload time.
 *
 * Today the choice is driven globally by the `PROVIDER_STORAGE_CODE` env var
 * (same env var the rest of the codebase already references). A future
 * iteration can route per-request by reading the `provider_storage_code`
 * passed to the upload handler — the registry already has all backends
 * available via DI.
 */
@Injectable()
export class StorageBackendRegistry {
  private readonly backends: Map<string, StorageBackend>;

  constructor(
    private readonly config: ConfigService,
    localBackend: LocalStorageBackend,
    s3Backend: S3StorageBackend,
  ) {
    this.backends = new Map<string, StorageBackend>([
      [localBackend.code, localBackend],
      [s3Backend.code, s3Backend],
    ]);
  }

  /**
   * Returns the backend matching `code`, or the env-configured default when
   * code is omitted. Throws if the code is unknown — callers should validate
   * the provider exists before calling.
   */
  resolve(code?: string): StorageBackend {
    const resolvedCode = (
      code ??
      this.config.get<string>('PROVIDER_STORAGE_CODE') ??
      'LOCAL'
    ).toUpperCase();
    const backend = this.backends.get(resolvedCode);
    if (!backend) {
      throw new Error(
        `No storage backend registered for code "${resolvedCode}". ` +
          `Available: ${[...this.backends.keys()].join(', ')}`,
      );
    }
    return backend;
  }
}
