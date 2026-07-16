import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { Express } from 'express';
import { StorageBackend } from './storage-backend';
import { MIME_TO_EXTENSION } from '../config/multer-file-filter.config';

/**
 * S3-compatible backend (AWS S3, MinIO, Cloudflare R2, Backblaze B2, etc).
 *
 * Required env vars:
 *   S3_BUCKET     - bucket name
 *   S3_REGION     - AWS region (use `us-east-1` for MinIO/R2 when not applicable)
 * Optional env vars:
 *   S3_ENDPOINT          - custom endpoint URL (set for non-AWS providers like MinIO/R2)
 *   S3_ACCESS_KEY_ID     - explicit access key (omit to use IAM role / default chain)
 *   S3_SECRET_ACCESS_KEY - explicit secret (omit to use IAM role / default chain)
 *   S3_FORCE_PATH_STYLE  - "true" for MinIO and other path-style providers
 *   S3_PUBLIC_BASE_URL   - if set, returned path uses this (e.g. CDN URL); otherwise `s3://bucket/key`
 *   S3_KEY_PREFIX        - optional prefix applied to every uploaded key (e.g. "profiles/")
 */
@Injectable()
export class S3StorageBackend extends StorageBackend {
  readonly code = 'S3';
  private readonly logger = new Logger(S3StorageBackend.name);
  private client: S3Client | null = null;
  private bucket: string | null = null;
  private keyPrefix: string = '';
  private publicBaseUrl?: string;

  constructor(private readonly config: ConfigService) {
    super();
    const isS3Selected =
      (
        this.config.get<string>('PROVIDER_STORAGE_CODE') ?? 'LOCAL'
      ).toUpperCase() === 'S3';

    const region = this.config.get<string>('S3_REGION');
    const bucket = this.config.get<string>('S3_BUCKET');

    // Fail-fast only when S3 is the active backend — same as original behaviour.
    if (isS3Selected && (!region || !bucket)) {
      throw new Error(
        'S3StorageBackend requires S3_REGION and S3_BUCKET env vars.',
      );
    }

    if (region && bucket) {
      this.bucket = bucket;
      this.keyPrefix = (this.config.get<string>('S3_KEY_PREFIX') ?? '').replace(
        /^\/+|\/+$/g,
        '',
      );
      this.publicBaseUrl = this.config.get<string>('S3_PUBLIC_BASE_URL');

      const accessKeyId = this.config.get<string>('S3_ACCESS_KEY_ID');
      const secretAccessKey = this.config.get<string>('S3_SECRET_ACCESS_KEY');
      const endpoint = this.config.get<string>('S3_ENDPOINT');
      const forcePathStyle =
        this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true';

      this.client = new S3Client({
        region,
        endpoint,
        forcePathStyle,
        // If explicit credentials aren't supplied, the SDK falls back to the
        // default provider chain (env, container role, IMDS). Prefer that in
        // production (IAM role) and only set keys for local/dev/CI.
        credentials:
          accessKeyId && secretAccessKey
            ? { accessKeyId, secretAccessKey }
            : undefined,
      });
    }
  }

  async upload(file: Express.Multer.File, folder?: string): Promise<{ path: string }> {
    if (!this.client || !this.bucket) {
      throw new Error(
        'S3StorageBackend requires S3_REGION and S3_BUCKET env vars.',
      );
    }
    const ext = MIME_TO_EXTENSION[file?.mimetype] ?? 'bin';
    const activeFolder = folder || this.keyPrefix;
    const key = `${activeFolder ? activeFolder + '/' : ''}${randomUUID()}.${ext}`;
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      this.logger.error(
        `S3 upload failed for key=${key}: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
    const path = this.publicBaseUrl
      ? `${this.publicBaseUrl.replace(/\/+$/, '')}/${key}`
      : `s3://${this.bucket}/${key}`;
    return { path };
  }
}
