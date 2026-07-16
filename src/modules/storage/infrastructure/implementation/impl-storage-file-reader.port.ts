import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { StorageFileReaderPort } from '../../domain/ports/storage-file-reader.port';
import { MIME_TO_EXTENSION } from '../config/multer-file-filter.config';

const EXTENSION_TO_MIME: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(MIME_TO_EXTENSION).map(([mime, ext]) => [ext, mime]),
);

@Injectable()
export class ImplStorageFileReaderPort extends StorageFileReaderPort {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async readFileAsBase64(filePath: string): Promise<string | null> {
    try {
      const buffer = await readFile(filePath);
      const ext = extname(filePath).slice(1).toLowerCase();
      const mime = EXTENSION_TO_MIME[ext] ?? 'application/octet-stream';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    } catch {
      return null;
    }
  }

  resolveUrl(filePath: string): string | null {
    if (!filePath) return null;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    if (filePath.startsWith('s3://')) {
      const publicBaseUrl = this.configService.get<string>('S3_PUBLIC_BASE_URL');
      if (!publicBaseUrl) {
        return filePath;
      }
      const parts = filePath.replace('s3://', '').split('/');
      parts.shift(); // remove bucket name
      const key = parts.join('/');
      return `${publicBaseUrl.replace(/\/+$/, '')}/${key}`;
    }

    return filePath;
  }
}
