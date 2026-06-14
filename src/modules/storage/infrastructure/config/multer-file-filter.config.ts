import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';

export const ALLOWED_MIME_TYPES: ReadonlyArray<string> = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

/** Maps MIME type to a safe file extension. */
export const MIME_TO_EXTENSION: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
} as const;

/** 5 MB */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Validates the actual file content via magic bytes (file signature).
 * This prevents MIME type spoofing by clients.
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  mimetype: string,
): boolean {
  if (!buffer || buffer.length < 4) return false;
  switch (mimetype) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    case 'image/gif':
      return (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      );
    case 'image/webp':
      return (
        buffer.length >= 12 &&
        buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
        buffer.slice(8, 12).toString('ascii') === 'WEBP'
      );
    default:
      return false;
  }
}

export const multerImageOptions: MulterOptions = {
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `File type '${file.mimetype}' is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
        ),
        false,
      );
    }
    callback(null, true);
  },
};
