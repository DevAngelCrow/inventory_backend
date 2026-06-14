import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Express } from 'express';
import { StorageBackend } from './storage-backend';
import { MIME_TO_EXTENSION } from '../config/multer-file-filter.config';

@Injectable()
export class LocalStorageBackend extends StorageBackend {
  readonly code = 'LOCAL';
  private readonly diskPath = join(process.cwd(), 'storage');
  private readonly basePath = 'profile_img';

  async upload(file: Express.Multer.File): Promise<{ path: string }> {
    const ext = MIME_TO_EXTENSION[file?.mimetype] ?? 'bin';
    const filename = randomUUID() + '.' + ext;
    const folder = join(this.diskPath, this.basePath);
    await mkdir(folder, { recursive: true });
    const fullPath = join(folder, filename);
    await writeFile(fullPath, file.buffer);
    return { path: fullPath };
  }
}
