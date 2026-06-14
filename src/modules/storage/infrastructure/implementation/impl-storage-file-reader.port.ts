import { Injectable } from '@nestjs/common';
import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { StorageFileReaderPort } from '../../domain/ports/storage-file-reader.port';
import { MIME_TO_EXTENSION } from '../config/multer-file-filter.config';

const EXTENSION_TO_MIME: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(MIME_TO_EXTENSION).map(([mime, ext]) => [ext, mime]),
);

@Injectable()
export class ImplStorageFileReaderPort extends StorageFileReaderPort {
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
}
